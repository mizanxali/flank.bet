import { WebSocketServer } from "ws";
import { glob } from "glob";
import * as jsonl from "node-jsonl";
import { SeriesEventTypes } from "@types";
import db from "./db";
import { FieldValue } from "firebase-admin/firestore";
import web3 from "web3";
import BankABI from "../../smart-contracts/artifacts/contracts/Bank.sol/Bank.json";
require("dotenv").config();

const delayMs = 1000;

const wss = new WebSocketServer({
  port: 8080,
});

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

wss.on("connection", async function connection(ws, req) {
  console.log(req.url);

  const matchID = req.url?.replace("/", "");

  if (!matchID) {
    throw new Error("matchID not defined");
    return;
  }

  const jsfiles = await glob(`**/${req.url}_events.jsonl`, {
    ignore: "node_modules/**",
  });

  console.log("Emitting", jsfiles[0]);

  const rl = jsonl.readlines(jsfiles[0]);

  while (true) {
    const { value: line, done } = await rl.next();

    if (done) {
      console.log("done", done);
      ws.send("done");
      break;
    }

    // ws.send(JSON.stringify(line));
    // continue;

    const event = (line as any).events[0];
    const sequenceNumber = (line as any).sequenceNumber;
    const type: string = event.type;
    const actor = event.actor;
    const target = event.target;
    const id = event.id;

    if (sequenceNumber === 3 || sequenceNumber === 5 || sequenceNumber === 4180)
      continue;

    switch (type) {
      case SeriesEventTypes.seriesStartedGame:
        await delay(10000);
        await getOrSetData(matchID, {
          timestamp: FieldValue.serverTimestamp(),
          id,
          sequenceNumber,
          type: "map",
          active: true,
          question: `Who will win the map - ${target.state.map.name}?`,
          options: [
            `${target.state.teams[0].name} - ${target.state.teams[0].side}`,
            `${target.state.teams[1].name} - ${target.state.teams[1].side}`,
          ],
          bets: [],
        });
        break;
      case SeriesEventTypes.gameStartedRound:
        break;
      case SeriesEventTypes.gameEndedRound:
        await delay(10000);
        await finishBets("round", matchID, true);
        await finishBets("bomb", matchID, true);
        break;
      case SeriesEventTypes.roundStartedFreezetime:
        await delay(3000);

        await getOrSetData(matchID, {
          timestamp: FieldValue.serverTimestamp(),
          id,
          sequenceNumber,
          type: "round",
          active: true,
          question: `Who will win ${actor.id}?`,
          options: [
            `${actor.state.teams[0].name} - ${actor.state.teams[0].side}`,
            `${actor.state.teams[1].name} - ${actor.state.teams[1].side}`,
          ],
          bets: [],
        });

        await getOrSetData(matchID, {
          timestamp: FieldValue.serverTimestamp(),
          id,
          sequenceNumber,
          type: "bomb",
          active: true,
          question: `Will the bomb be planted in this round?`,
          options: [`Yes`, `No`],
          bets: [],
        });
        break;
      case SeriesEventTypes.roundEndedFreezetime:
        break;
      case SeriesEventTypes.teamWonRound:
        await delay(10000);
        await finishBets("round", matchID, true);
        break;
      case SeriesEventTypes.playerCompletedPlantBomb:
        await delay(10000);
        await finishBets("bomb", matchID, true);
        await getOrSetData(matchID, {
          timestamp: FieldValue.serverTimestamp(),
          id,
          sequenceNumber,
          type: "bomb",
          active: true,
          question: `Will the bomb be defused in this round?`,
          options: [`Yes`, `No`],
          bets: [],
        });
        break;
      case SeriesEventTypes.playerCompletedDefuseBomb:
        await delay(10000);
        await finishBets("bomb", matchID, true);
        break;
      case SeriesEventTypes.playerCompletedExplodeBomb:
        await delay(10000);
        await finishBets("bomb", matchID, false);
        break;
      case SeriesEventTypes.playerKilledPlayer:
        break;
      case SeriesEventTypes.teamWonGame:
        await delay(10000);
        await finishBets("map", matchID, true);
        break;
      default:
        continue;
    }

    // if (data) ws.send(JSON.stringify(data));
  }
});

async function getOrSetData(matchID: string, obj: Object) {
  var questionsRef = db
    .collection("matches")
    .doc(matchID)
    .collection("questions");
  await questionsRef.add(obj);
}

async function finishBets(
  type: string,
  matchID: string,
  didPrimaryOptionWin: boolean
) {
  var questionsRef = db
    .collection("matches")
    .doc(matchID)
    .collection("questions");
  const query = questionsRef
    .where("type", "==", type)
    .where("active", "==", true);

  return new Promise((resolve, reject) => {
    updateQueryBatch(query, resolve, didPrimaryOptionWin).catch(reject);
  });
}

async function updateQueryBatch(
  query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
  resolve: any,
  didPrimaryOptionWin: boolean
) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc: any) => {
    console.log("Updating doc!");
    distributeWinnings(doc.data(), didPrimaryOptionWin, doc.ref);
    batch.update(doc.ref, { active: false });
  });
  await batch.commit();

  process.nextTick(() => {
    updateQueryBatch(query, resolve, didPrimaryOptionWin);
  });
}

async function distributeWinnings(
  data: any,
  didPrimaryOptionWin: boolean,
  docRef: any
) {
  const bets: {
    address: string;
    option: number;
    amount: number;
    winnings: number;
  }[] = [...data.bets];

  const primaryBets = bets.filter((bet) => bet.option === 0);
  const secondaryBets = bets.filter((bet) => bet.option === 1);

  const primaryBetAmount = primaryBets.reduce((accumulator, object) => {
    return accumulator + object.amount;
  }, 0);
  const secondaryBetAmount = secondaryBets.reduce((accumulator, object) => {
    return accumulator + object.amount;
  }, 0);

  let win;

  if (didPrimaryOptionWin) {
    primaryBets.forEach((primaryBet) => {
      win =
        primaryBet.amount +
        (primaryBet.amount / primaryBetAmount) * secondaryBetAmount;

      const x = bets.find((bet) => bet.address === primaryBet.address);
      if (x) x.winnings = win;

      transferPrizeMoney(primaryBet.address, win.toString());
    });
    console.log({ win });
  } else {
    secondaryBets.forEach((secondaryBet) => {
      win =
        secondaryBet.amount +
        (secondaryBet.amount / secondaryBetAmount) * primaryBetAmount;

      const x = bets.find((bet) => bet.address === secondaryBet.address);
      if (x) x.winnings = win;

      transferPrizeMoney(secondaryBet.address, win.toString());
    });
    console.log({ win });
  }

  await docRef.update({ bets: [...bets] });
}

async function transferPrizeMoney(address: string, amount: string) {
  // const web3js = new web3(
  //   new web3.providers.HttpProvider(
  //     `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  //   )
  // );
  // var myAddress = "0x73AE27967C2C98Dc168EC8f2b4cB1f2412239DEd";
  // var privateKey = process.env.PRIVATE_KEY;
  // var contractABI = BankABI.abi;
  // var contractAddress = process.env.CONTRACT_ADDRESS;
  // var contract = new web3js.eth.Contract(contractABI, contractAddress);

  // let transaction = {
  //   from: myAddress,
  //   to: process.env.CONTRACT_ADDRESS,
  //   data: (contract.methods.sendToPlayer as any)(
  //     "0x6DC0d2aFDD77d3fCe6ecef0d65e8D9266eeeC2b3",
  //     web3.utils.toWei("0.03", "ether")
  //   ).encodeABI(),
  // };

  // let rawTransaction = await web3js.eth.accounts.signTransaction(
  //   transaction,
  //   privateKey as any
  // );
  // let tx = await web3js.eth.sendSignedTransaction(
  //   rawTransaction.rawTransaction
  // );

  console.log({ address, amount });

  // const x = await method.send({ from: myAddress });
  // console.log({ x });
}

import { WebSocketServer } from "ws";
import { glob } from "glob";
import * as jsonl from "node-jsonl";
import { SeriesEventTypes } from "@types";
import db from "./db";

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
    const type: string = event.type;
    const actor = event.actor;
    const target = event.target;
    const id = event.id;

    switch (type) {
      case SeriesEventTypes.seriesStartedGame:
        await getOrSetData(id, matchID, {
          type: "map",
          active: true,
          question: `Who will win the map - ${target.state.map.name}?`,
          options: [
            {
              answer: `${target.state.teams[0].name} - ${target.state.teams[0].side}`,
            },
            {
              answer: `${target.state.teams[1].name} - ${target.state.teams[1].side}`,
            },
          ],
        });
        break;
      case SeriesEventTypes.gameStartedRound:
        break;
      case SeriesEventTypes.gameEndedRound:
        await finishBets("round", matchID);
        break;
      case SeriesEventTypes.roundStartedFreezetime:
        await getOrSetData(id, matchID, {
          type: "round",
          active: true,
          question: `Who will win the round?`,
          options: [
            {
              answer: `${actor.state.teams[0].name} - ${actor.state.teams[0].side}`,
            },
            {
              answer: `${actor.state.teams[1].name} - ${actor.state.teams[1].side}`,
            },
          ],
        });
        await getOrSetData(id, matchID, {
          type: "round",
          active: true,
          question: `Will the bomb be planted in this round?`,
          options: [
            {
              answer: `Yes`,
            },
            {
              answer: `No`,
            },
          ],
        });
        break;
      case SeriesEventTypes.roundEndedFreezetime:
        break;
      case SeriesEventTypes.teamWonRound:
        await finishBets("round", matchID);
        break;
      case SeriesEventTypes.playerCompletedPlantBomb:
        await getOrSetData(id, matchID, {
          type: "bomb",
          active: true,
          question: `Will the bomb be defused in this round?`,
          options: [
            {
              answer: `Yes`,
            },
            {
              answer: `No`,
            },
          ],
        });
      case SeriesEventTypes.playerCompletedDefuseBomb:
        await finishBets("bomb", matchID);
        break;
      case SeriesEventTypes.playerCompletedExplodeBomb:
        await finishBets("bomb", matchID);
        break;
      case SeriesEventTypes.playerKilledPlayer:
        break;
      case SeriesEventTypes.teamWonGame:
        await finishBets("map", matchID);
        break;
      default:
        continue;
    }
    // if (data) ws.send(JSON.stringify(data));
  }
});

async function getOrSetData(id: string, matchID: string, obj: Object) {
  var betsRef = db.collection("matches").doc(matchID).collection("bets");
  const doc = await betsRef.doc(id).get();

  if (!doc.exists) {
    console.log("No such document!");
    await betsRef.doc(id).set(obj);
  } else {
    console.log("Document already exists!");
  }
}

async function finishBets(type: string, matchID: string) {
  var betsRef = db.collection("matches").doc(matchID).collection("bets");
  const query = betsRef.where("type", "==", type);

  return new Promise((resolve, reject) => {
    updateQueryBatch(query, resolve).catch(reject);
  });
}

async function updateQueryBatch(
  query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
  resolve: any
) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc: any) => {
    batch.update(doc.ref, { active: false });
  });
  await batch.commit();

  process.nextTick(() => {
    updateQueryBatch(query, resolve);
  });
}

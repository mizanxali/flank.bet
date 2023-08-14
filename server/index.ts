import { WebSocketServer } from "ws";
import { glob } from "glob";
import * as jsonl from "node-jsonl";
import { SeriesEventTypes, SocketResponse } from "@types";

const delayMs = 1000;

const wss = new WebSocketServer({
  port: 8080,
});

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

wss.on("connection", async function connection(ws, req) {
  console.log(req.url);

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

    const type: string = (line as any).events[0].type;
    const actor = (line as any).events[0].actor;
    const target = (line as any).events[0].target;

    let data;

    switch (type) {
      case SeriesEventTypes.seriesStartedGame:
        data = {
          type,
          map: target.state.map.name,
          teams: [
            {
              name: target.state.teams[0].name,
              side: target.state.teams[0].side,
            },
            {
              name: target.state.teams[1].name,
              side: target.state.teams[1].side,
            },
          ],
        };
        break;
      case SeriesEventTypes.gameStartedRound:
      case SeriesEventTypes.gameEndedRound:
        data = {
          type,
          round: target.state.id,
        };
        break;
      case SeriesEventTypes.roundStartedFreezetime:
      case SeriesEventTypes.roundEndedFreezetime:
        break;
      case SeriesEventTypes.teamWonRound:
        data = {
          type,
          team: { name: actor.state.name, side: actor.state.round.side },
        };
        break;
      case SeriesEventTypes.playerCompletedPlantBomb:
      case SeriesEventTypes.playerCompletedDefuseBomb:
        data = {
          type,
          player: { name: actor.state.name, side: actor.state.side },
        };
        break;
      case SeriesEventTypes.playerCompletedExplodeBomb:
        break;
      case SeriesEventTypes.playerKilledPlayer:
        data = {
          type,
          kill: { name: actor.state.name, side: actor.state.side },
          death: { name: target.state.name, side: target.state.side },
        };
        break;
      case SeriesEventTypes.teamWonGame:
        data = {
          type,
          team: { name: actor.state.name, side: actor.state.side },
        };
        break;
      default:
        continue;
    }
    if (data) ws.send(JSON.stringify(data));
  }
});

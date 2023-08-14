import { WebSocketServer } from "ws";
import jsonlFile from "jsonl-db";
import { glob } from "glob";
import * as jsonl from "node-jsonl";

const delayMs = 1000;

const wss = new WebSocketServer({
  port: 8080,
});

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

wss.on("connection", async function connection(ws, req) {
  console.log(req.url);

  const jsfiles = await glob(`**/${req.url}_events.jsonl`, {
    ignore: "node_modules/**",
  });

  console.log("Emitting", jsfiles[0]);

  // const eventsFile = jsonlFile(jsfiles[0]);
  // const count = await eventsFile.count();
  // console.log({ count });

  // eventsFile.read((line) => {
  //    ws.send(JSON.stringify(line));
  // });

  const rl = jsonl.readlines(jsfiles[0]);

  while (true) {
    const { value: line, done } = await rl.next();

    if (done) {
      console.log("done", done);
      ws.send("done");
      break;
    }

    const type = line.events[0].type;

    switch (type) {
      case "series-started-game" || "series-ended-game":
        ws.send(JSON.stringify(line));
        break;
      case "round-started-freezetime":
        ws.send(JSON.stringify(line));
        break;
      case "round-ended-freezetime":
        // await delay(delayMs);
        ws.send(JSON.stringify(line));
        break;
      case "team-won-round":
        ws.send(JSON.stringify(line));
        break;
      case "player-completed-plantBomb":
        // await delay(delayMs);
        ws.send(JSON.stringify(line));
        break;
      case "player-completed-defuseBomb":
        // await delay(delayMs);
        ws.send(JSON.stringify(line));
        break;
      case "player-completed-explodeBomb":
        // await delay(delayMs);
        ws.send(JSON.stringify(line));
        break;
      case "player-killed-player":
        // await delay(delayMs);
        ws.send(JSON.stringify(line));
        break;
      case "player-dropped-item":
      case "player-purchased-item":
      case "player-pickedUp-item":
      case "player-damaged-player":
      case "player-teamdamaged-player":
      case "freezetime-started-timeout":
      case "freezetime-ended-timeout":
      case "player-selfdamaged-player":
      case "player-completed-beginDefuseWithoutKit":
      case "player-completed-beginDefuseWithKit":
        break;
      default:
        ws.send(JSON.stringify(line));
    }
  }
});

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    startEvents();
  }, []);

  const startEvents = async () => {
    // const ws = new WebSocket("ws://localhost:8080/2579048");
    // const ws = new WebSocket("ws://localhost:8080/2579089");
    const ws = new WebSocket("ws://localhost:8080/2578928");

    let count = 0;

    ws.onmessage = (event) => {
      count++;

      if (event.data === "done") {
        console.log("Done");
        return;
      }

      const data = JSON.parse(event.data);
      const type = data.events[0].type;
      const actor = data.events[0].actor;
      const target = data.events[0].target;

      if (type === "series-started-game") {
        console.log("--- MATCH BEGINS ---");
        console.log("map: ", target.state.map.name);
        console.log(
          "team 1: ",
          target.state.teams[0].name,
          target.state.teams[0].side
        );
        console.log(
          "team 2: ",
          target.state.teams[1].name,
          target.state.teams[0].side
        );
      } else if (type === "game-ended-round") {
        console.log(" --- ", target.state.id, "ENDS ---");
      } else if (type === "game-started-round") {
        console.log("--- ", target.state.id, " BEGINS ---");
      } else if (type === "round-started-freezetime") {
      } else if (type === "round-ended-freezetime") {
      } else if (type === "player-killed-player") {
        console.log("--- KILL! ---");
        console.log("killer: ", actor.state.name, actor.state.side);
        console.log("killed: ", target.state.name, target.state.side);
      } else if (type === "team-won-round") {
        console.log("--- ", actor.state.name, " WIN ROUND ---");
      } else if (type === "player-completed-plantBomb") {
        console.log("--- BOMB PLANTED! ---");
        console.log("planter: ", actor.state.name);
      } else if (type === "player-completed-defuseBomb") {
        console.log("--- BOMB DEFUSED! ---");
        console.log("planter: ", actor.state.name);
      } else if (type === "player-completed-explodeBomb") {
        console.log("--- BOMB EXPLODED! ---");
        console.log("planter: ", actor.state.name);
      } else if (type === "team-won-game") {
        console.log("--- ", actor.state.name, " WINS GAME ---");
      } else {
        console.log({ type, data });
      }
    };
  };

  return (
    <div className="w-full h-screen">
      {/* <iframe
        src="https://player.twitch.tv/?channel=wardell&parent=localhost"
        height="100%"
        width="100%"
        allowFullScreen
      ></iframe> */}
    </div>
  );
}

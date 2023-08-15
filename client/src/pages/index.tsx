import db from "@/db";
import { IBet } from "@/types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const [bets, setBets] = useState<IBet[]>([]);

  useEffect(() => {
    startEvents();
  }, []);

  const startEvents = async () => {
    // const ws = new WebSocket("ws://localhost:8080/2579048");
    // const ws = new WebSocket("ws://localhost:8080/2579089");
    const ws = new WebSocket("ws://localhost:8080/2578928");

    // let count = 0;

    // ws.onmessage = (event) => {
    //   count++;

    //   if (event.data === "done") {
    //     console.log("Done");
    //     return;
    //   }

    //   const data: SocketResponse = JSON.parse(event.data);
    //   const { type, id } = data;

    //   console.log(data);

    //   // if (type === SeriesEventTypes.seriesStartedGame) {
    //   //   console.log("--- MATCH BEGINS ---");
    //   //   console.log("map: ", data.map);
    //   //   console.log("team 1: ", data.teams[0].name, data.teams[0].side);
    //   //   console.log("team 2: ", data.teams[1].name, data.teams[1].side);
    //   // } else if (type === SeriesEventTypes.gameEndedRound) {
    //   //   console.log(" --- ", data.round, "ENDS ---");
    //   // } else if (type === SeriesEventTypes.gameStartedRound) {
    //   //   console.log("--- ", data.round, " BEGINS ---");
    //   // } else if (type === SeriesEventTypes.roundStartedFreezetime) {
    //   // } else if (type === SeriesEventTypes.roundEndedFreezetime) {
    //   // } else if (type === SeriesEventTypes.playerKilledPlayer) {
    //   //   console.log("--- KILL! ---");
    //   //   console.log("killer: ", data.kill.name, data.kill.side);
    //   //   console.log("killed: ", data.death.name, data.death.side);
    //   // } else if (type === SeriesEventTypes.teamWonRound) {
    //   //   console.log("--- ", data.team.name, data.team.side, " WINS ROUND ---");
    //   // } else if (type === SeriesEventTypes.playerCompletedPlantBomb) {
    //   //   console.log("--- BOMB PLANTED! ---");
    //   //   console.log("planter: ", data.player.name);
    //   // } else if (type === SeriesEventTypes.playerCompletedDefuseBomb) {
    //   //   console.log("--- BOMB DEFUSED! ---");
    //   //   console.log("planter: ", data.player.name);
    //   // } else if (type === SeriesEventTypes.playerCompletedExplodeBomb) {
    //   //   console.log("--- BOMB EXPLODED! ---");
    //   // } else if (type === SeriesEventTypes.teamWonGame) {
    //   //   console.log("--- ", data.team.name, " WINS GAME ---");
    //   // } else {
    //   //   console.log({ type, data });
    //   // }
    // };
  };

  useEffect(() => {
    const q = query(
      collection(db, "matches/2578928/bets"),
      where("active", "==", true)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newBets = [...bets];
      querySnapshot.forEach((doc) => {
        newBets.push(doc.data() as IBet);
        setBets([...newBets]);
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="w-full h-screen">
      {/* <iframe
        src="https://player.twitch.tv/?channel=wardell&parent=localhost"
        height="100%"
        width="100%"
        allowFullScreen
      ></iframe> */}
      {bets.map((bet) => (
        <h1>{bet.question}</h1>
      ))}
    </div>
  );
}

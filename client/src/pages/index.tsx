import db from "@/db";
import { IBet } from "@/types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const [bets, setBets] = useState<IBet[]>([]);

  useEffect(() => {
    startEvents();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "matches/2578928/bets"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newBets: IBet[] = [];
      querySnapshot.forEach((doc) => {
        newBets.push(doc.data() as IBet);
        newBets.sort((a, b) => b.timestamp - a.timestamp);
        setBets([...newBets]);
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const startEvents = async () => {
    // const ws = new WebSocket("ws://localhost:8080/2579048");
    // const ws = new WebSocket("ws://localhost:8080/2579089");
    const ws = new WebSocket("ws://localhost:8080/2578928");
  };

  const lockBet = async () => {};

  return (
    <div className="w-full h-screen">
      {/* <iframe
        src="https://player.twitch.tv/?channel=wardell&parent=localhost"
        height="100%"
        width="100%"
        allowFullScreen
      ></iframe> */}
      <ConnectButton />
      {bets.map((bet) => (
        <div className="flex flex-col items-center gap-2 border-2 border-white p-4 m-4">
          <h6>{bet.active ? "ACTIVE" : "COMPLETED"}</h6>
          <h1>{bet.question}</h1>
          <div className="w-full flex-1 flex gap-4">
            <div className="flex-1 flex flex-col items-center gap-2">
              <h1>{bet.options[0].answer}</h1>
              <button
                className="rounded-lg border-white border-2 p-2"
                onClick={() => lockBet()}
              >
                BET
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <h1>{bet.options[1].answer}</h1>
              <button
                className="rounded-lg border-white border-2 p-2"
                onClick={() => lockBet()}
              >
                BET
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

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

    // ws.onmessage = (event) => {
    //   if (event.data === "done") {
    //     console.log("Done");
    //     return;
    //   }

    //   const data = JSON.parse(event.data);
    //   console.log(data);
    // }
  };

  useEffect(() => {
    const q = query(
      collection(db, "matches/2578928/bets"),
      where("active", "==", true)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newBets: IBet[] = [];
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

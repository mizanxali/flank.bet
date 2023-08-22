import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import BetCard from "@/components/BetCard";
import db from "@/db";
import { IBet } from "@/types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function Home() {
  const { address, isDisconnected, isConnected } = useAccount();

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
    <Layout>
      <div className="">
        {/* <iframe
        src="https://player.twitch.tv/?channel=wardell&parent=localhost"
        height="100%"
        width="100%"
        allowFullScreen
      ></iframe> */}
        <div className="flex flex-col gap-3">
          {bets.map((bet) => (
            <BetCard bet={bet} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

import BetCard from "@/components/BetCard";
import Layout from "@/components/Layout";
import db from "@/db";
import { IQuestion } from "@/types";
import { parseEther } from "ethers";
import { collection, onSnapshot, query } from "firebase/firestore";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import BankABI from "../../../smart-contracts/artifacts/contracts/Bank.sol/Bank.json";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

enum Tabs {
  Ongoing,
  Ended,
}

export default function Home() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x5C8c13D8EE18b1Cb71b919107CA9C0a517518174",
    abi: BankABI.abi,
    functionName: "getTotalBalance",
  });

  const { config } = usePrepareContractWrite({
    address: "0x5C8c13D8EE18b1Cb71b919107CA9C0a517518174",
    abi: BankABI.abi,
    functionName: "deposit",
    args: [parseEther("0.05")],
    value: parseEther("0.05"),
  });
  const { write } = useContractWrite(config);

  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const activeQuestions = useMemo(
    () => questions.filter((question) => question.active),
    [questions]
  );
  const inactiveQuestions = useMemo(
    () => questions.filter((question) => !question.active),
    [questions]
  );

  const [selectedTab, setSelectedTab] = useState(Tabs.Ongoing);

  // useEffect(() => {
  //   startEvents();
  // }, []);

  useEffect(() => {
    const q = query(collection(db, "matches/2578928/questions"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newQuestions: IQuestion[] = [];
      querySnapshot.forEach((doc) => {
        newQuestions.push({ ...doc.data(), id: doc.id } as IQuestion);
        newQuestions.sort((a, b) => b.timestamp - a.timestamp);
        setQuestions([...newQuestions]);
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // const startEvents = async () => {
  //   // const ws = new WebSocket("ws://localhost:8080/2579048");
  //   // const ws = new WebSocket("ws://localhost:8080/2579089");
  //   const ws = new WebSocket("ws://localhost:8080/2578928");
  // };

  return (
    <Layout>
      <div className="w-full px-10">
        <ReactPlayer
          muted
          width={"100%"}
          height={600}
          playing
          url="https://youtu.be/A0BR4RyPogA?si=gVZz5Kgf4kFdtecW"
          style={{ pointerEvents: "none" }}
          config={{ youtube: { playerVars: { start: "325", controls: 0 } } }}
        />
        <div className="my-2 flex gap-4">
          <div
            onClick={() => setSelectedTab(Tabs.Ongoing)}
            className={`cursor-pointer ${
              selectedTab === Tabs.Ongoing
                ? "text-light-2 border-b-2 pb-0.5 border-light-2"
                : "text-whites-2"
            }`}
          >
            Ongoing - {activeQuestions.length}
          </div>
          <div
            onClick={() => setSelectedTab(Tabs.Ended)}
            className={`cursor-pointer ${
              selectedTab === Tabs.Ended
                ? "text-light-2 border-b-2 pb-0.5 border-light-2"
                : "text-whites-2"
            }`}
          >
            Ended - {inactiveQuestions.length}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {selectedTab === Tabs.Ongoing
            ? activeQuestions.map((qn) => (
                <BetCard key={qn.id} qn={qn} depositToContract={write} />
              ))
            : inactiveQuestions.map((qn) => (
                <BetCard key={qn.id} qn={qn} depositToContract={write} />
              ))}
        </div>
      </div>
    </Layout>
  );
}

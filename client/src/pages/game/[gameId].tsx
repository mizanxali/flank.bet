import BetCard from "@/components/BetCard";
import Layout from "@/components/Layout";
import { GAME_STREAMS } from "@/constants";
import db from "@/db";
import { IQuestion } from "@/types";
import { parseEther } from "ethers";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import BankABI from "../../../../smart-contracts/artifacts/contracts/Bank.sol/Bank.json";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

enum Tabs {
  Ongoing,
  Ended,
}

export default function Game() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { gameId } = router.query;

  // wagmi hooks
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: BankABI.abi,
    functionName: "deposit",
    args: [parseEther("0.05")],
    value: parseEther("0.05"),
  });
  const { write } = useContractWrite(config);

  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [selectedTab, setSelectedTab] = useState(Tabs.Ongoing);

  const activeQuestions = useMemo(
    () => questions.filter((question) => question.active),
    [questions]
  );
  const inactiveQuestions = useMemo(
    () => questions.filter((question) => !question.active),
    [questions]
  );

  useEffect(() => {
    if (searchParams.get("events")) startEvents();
  }, [searchParams]);

  useEffect(() => {
    if (!router.isReady) return;

    const docRef = doc(db, "matches", gameId as string);
    getDoc(docRef).then((docSnap) => {
      const data = docSnap.data();
      if (data) {
        setHomeTeam(data.homeTeam);
        setAwayTeam(data.awayTeam);
      }
    });

    const q = query(collection(db, `matches/${gameId}/questions`));

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
  }, [router.isReady]);

  const startEvents = async () => {
    // const ws = new WebSocket("ws://localhost:8080/2579048");
    // const ws = new WebSocket("ws://localhost:8080/2579089");
    const ws = new WebSocket("ws://localhost:8080/2578928");
  };

  if (!gameId) return <div>Loading...</div>;

  return (
    <Layout showSidebar>
      <div className="px-10">
        <ReactPlayer
          muted
          width={"100%"}
          height={600}
          playing
          url={GAME_STREAMS[`${gameId}`].url}
          style={{ pointerEvents: "none" }}
          config={{
            youtube: {
              playerVars: {
                start: GAME_STREAMS[`${gameId}`].startAt,
                controls: 0,
              },
            },
          }}
        />
        <div className="my-3 font-bold text-3xl">
          {homeTeam} vs {awayTeam}
        </div>
        <div className="my-3 flex gap-4">
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

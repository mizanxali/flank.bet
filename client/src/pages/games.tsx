import GameCard from "@/components/GameCard";
import Layout from "@/components/Layout";
import Sidebar from "@/components/Sidebar";
import { GAME_STREAMS } from "@/constants";
import Link from "next/link";

export default function Games() {
  return (
    <Layout showSidebar>
      <div className="">
        <h3 className="text-2xl font-bold my-3">Live Games</h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.keys(GAME_STREAMS).map((key) => (
            <Link href={`/game/${key}`}>
              <GameCard
                key={GAME_STREAMS[key].url}
                image={GAME_STREAMS[key].thumbnail}
                title={GAME_STREAMS[key].title}
              />
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

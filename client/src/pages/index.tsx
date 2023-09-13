import Layout from "@/components/Layout";
import { Chakra_Petch } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
const chakraPetch = Chakra_Petch({ subsets: ["latin"], weight: "700" });

export default function Home() {
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      setIsDefinitelyConnected(true);
    } else {
      setIsDefinitelyConnected(false);
    }
  }, [address]);

  return (
    <Layout>
      <div
        className="flex-1 flex flex-col w-full h-full gap-5 items-center justify-center text-center"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <h1 className={`${chakraPetch.className} text-5xl text-light-6`}>
          Welcome to the new home of Esports Micro-Betting
        </h1>
        <p className={`${chakraPetch.className} text-2xl text-light-5`}>
          Put your understanding of the game to the test by betting on
          micro-events in esports matches using the power of crypto. Experience
          seamless transactions, instant payouts, and enjoy a whole new level of
          excitement and security.
        </p>

        {isDefinitelyConnected ? (
          <Link href="/games">
            <div className="bg-light-1 text-whites-3 font-semibold px-10 py-4 rounded-md">
              Browse Games
            </div>
          </Link>
        ) : (
          <h6 className="text-lg text-light-7">
            Connect your wallet to get started.
          </h6>
        )}
      </div>
    </Layout>
  );
}

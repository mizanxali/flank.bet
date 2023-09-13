import Layout from "@/components/Layout";
import { Chakra_Petch } from "next/font/google";
import Link from "next/link";
import { useAccount } from "wagmi";
const chakraPetch = Chakra_Petch({ subsets: ["latin"], weight: "700" });

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <Layout>
      <div
        className="flex-1 flex flex-col w-full h-full gap-4 items-center justify-center text-center"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <h1 className={`${chakraPetch.className} text-5xl text-light-6`}>
          Welcome to the new home of Esports MicroBetting
        </h1>
        {/* {isConnected ? (
          <Link href="/games">
            <div className="bg-light-1 text-whites-3 font-semibold px-10 py-4 rounded-md">
              Browse Games
            </div>
          </Link>
        ) : (
          <h6 className="text-2xl text-light-5">
            Connect your wallet to get started
          </h6>
        )} */}
      </div>
    </Layout>
  );
}

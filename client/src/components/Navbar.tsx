import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import React from "react";
import { Chakra_Petch } from "next/font/google";
const chakraPetch = Chakra_Petch({ subsets: ["latin"], weight: "700" });

function Navbar() {
  return (
    <div className="w-full bg-blacks-1 flex justify-between p-4 fixed top-0 z-10">
      <div className="flex gap-2 justify-between items-center">
        <Image src="/flank-logo.png" width={64} height={64} alt="Logo" />
        <h1 className={`${chakraPetch.className} text-5xl text-light-3`}>
          Flank
        </h1>
      </div>
      <ConnectButton chainStatus={"none"} />
    </div>
  );
}

export default Navbar;

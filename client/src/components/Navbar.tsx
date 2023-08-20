import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

function Navbar() {
  return (
    <div className="w-full bg-black flex justify-end p-4 sticky top-0 z-10">
      <ConnectButton />
    </div>
  );
}

export default Navbar;

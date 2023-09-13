import React from "react";

import { BiSolidHomeSmile } from "react-icons/bi";
import { HiOutlineSignal, HiOutlineNewspaper } from "react-icons/hi2";
import { FiPlusSquare, FiSettings } from "react-icons/fi";
import { ImTicket } from "react-icons/im";
import { BsTag } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";

function Sidebar() {
  return (
    <div className="mt-24 fixed top-0 left-0 w-60 flex flex-col gap-4 px-4">
      <Link href="/">
        <div className="flex gap-2 w-full items-center px-3 py-2 rounded-md cursor-pointer hover:text-light-2">
          <span>
            <BiSolidHomeSmile />
          </span>
          <span>Home</span>
        </div>
      </Link>
      <div className="flex gap-2 w-full items-center bg-dark-4 text-light-2 px-3 py-2 rounded-md cursor-pointer hover:text-light-2">
        <span>
          <HiOutlineSignal />
        </span>
        <span>Browse</span>
      </div>
      <div className="flex gap-2 w-full items-center px-3 py-2 rounded-md cursor-pointer hover:text-light-2">
        <span>
          <FiPlusSquare />
        </span>
        <span>Following</span>
      </div>
      <div className="flex gap-2 w-full items-center px-3 py-2 rounded-md cursor-pointer hover:text-light-2">
        <span>
          <HiOutlineNewspaper />
        </span>
        <span>News</span>
      </div>

      <div className="border-t-[1px] border-dark-5 pt-6 flex gap-2 w-full items-center px-3 py-2 rounded-md cursor-pointer hover:text-light-2">
        <span>
          <BsTag />
        </span>
        <span>Referrals</span>
      </div>
      <div className="flex gap-2 w-full items-center px-3 py-2 rounded-md cursor-pointer hover:text-light-2">
        <span>
          <ImTicket />
        </span>
        <span>My Bets</span>
      </div>

      <div className="border-t-[1px] border-dark-5 pt-6 flex gap-2 w-full items-center px-3 py-2 rounded-md cursor-pointer hover:text-light-2">
        <span>
          <CgProfile />
        </span>
        <span>Profile</span>
      </div>
      <div className="flex gap-2 w-full items-center px-3 py-2 rounded-md cursor-pointer hover:text-light-2">
        <span>
          <FiSettings />
        </span>
        <span>Settings</span>
      </div>
    </div>
  );
}

export default Sidebar;

import React from "react";
import { LuMessageSquareText } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineFolderPlus } from "react-icons/hi2";
import { BsFilterCircle } from "react-icons/bs";


const sideMenubar = () => {
  return (
    <div className="bg-[rgb(240,242,245)] p-3 border-gray-300 border flex flex-col items-center justify-between">
      <div className="flex flex-col items-center gap-5">
        <div className="bg-[rgb(217,219,223)] p-2 rounded-full text-2xl cursor-pointer"><LuMessageSquareText /></div>
        <div className="bg-[rgb(217,219,223)] p-2 rounded-full text-2xl cursor-pointer"><HiOutlineFolderPlus /></div>
        <div className="bg-[rgb(217,219,223)] p-2 rounded-full text-2xl cursor-pointer"><BsFilterCircle /></div>
      </div>

      <div>
        <div className="text-2xl cursor-pointer"><IoSettingsOutline /></div>
      </div>
    </div>
  );
};

export default sideMenubar;

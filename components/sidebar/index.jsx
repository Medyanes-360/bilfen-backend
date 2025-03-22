"use client"
import React from "react";
import { BiBarChartAlt2 } from 'react-icons/bi';
import Link from "next/link";
import { PiSignOutFill } from 'react-icons/pi';
import { LuLayoutDashboard } from 'lucide-react';

function SideBar() {
  return (
    <aside className="fixed flex flex-col top-0 px-5 left-0 bg-white text-gray-900 h-screen border-r border-gray-200 w-[290px]">
      <div className="py-8 flex justify-start">
        <Link href="/">
          <span className="text-xl font-bold">LOGO</span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-start pt-12">
        <ul className="flex flex-col items-start gap-12">
          <li>
            <Link
              href="/"
              className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-black"
            >
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/istatistikler"
              className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-black"
            >
              <BiBarChartAlt2 size={20} />
              <span>İstatistikler</span>
            </Link>
          </li>
          <li>
            <button className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-black">
              <PiSignOutFill size={20} />
              <span>Çıkış Yap</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default SideBar;

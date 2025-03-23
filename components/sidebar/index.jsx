"use client";
import Link from "next/link";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiSignOutFill } from "react-icons/pi";
import { BiBarChartAlt2 } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { HiX } from "react-icons/hi";
import { useSidebarStore } from "@/utils";

export default function Sidebar() {
  const { isOpen, close } = useSidebarStore();

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50 flex flex-col transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0`}
    >
      <div className="py-8 flex justify-between items-center px-5">
        <div className="flex items-center gap-3">
          <img src="/globe.svg" alt="Logo" className="w-6 h-6" />
          <span className="text-xl font-bold">LOGO</span>
        </div>
        <button onClick={close} className="md:hidden">
          <HiX size={24} />
        </button>
      </div>
      <ul className="flex flex-col gap-6 px-5 mt-4 flex-grow">
        <li>
          <Link href="/" className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-black">
            <LuLayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/istatistikler" className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-black">
            <BiBarChartAlt2 size={20} />
            <span>İstatistikler</span>
          </Link>
        </li>
        <li>
          <Link href="/settings" className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-black">
            <FiSettings size={20} />
            <span>Ayarlar</span>
          </Link>
        </li>
      </ul>

      <div className="px-5 pb-8">
        <button className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-black w-full">
          <PiSignOutFill size={20} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}

"use client";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSidebarStore, useNotificationStore } from "@/utils";
import FeedbackDropdown from "./feedback/FeedbackDropdown";

export default function Navbar() {
  const toggleSidebar = useSidebarStore((state) => state.toggle);
  const { isOpen, toggle } = useNotificationStore();

  return (
    <nav className="relative h-16 md:w-[calc(100%-16rem)] w-full bg-white text-black flex items-center justify-between px-4 shadow-md">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
        >
          <RxHamburgerMenu size={24} />
        </button>
      </div>

      <div className="relative">
        <div
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
          onClick={toggle}
        >
          <IoMdNotificationsOutline size={24} />
        </div>

        {isOpen && <FeedbackDropdown />}
      </div>
    </nav>
  );
}

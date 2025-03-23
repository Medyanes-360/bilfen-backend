"use client";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSidebarStore } from "@/utils";

export default function Navbar() {
    const toggleSidebar = useSidebarStore((state) => state.toggle);

    return (
        <nav className="h-16 md:w-[calc(100%-16rem)] w-full bg-white text-black flex items-center justify-between px-4 shadow-md">
            <div className="flex items-center">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
                >
                    <RxHamburgerMenu size={24} />
                </button>
            </div>

            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition">
                    <IoMdNotificationsOutline size={24} />
                </div>
            </div>
        </nav>
    );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiSignOutFill } from "react-icons/pi";
import { BiBarChartAlt2 } from "react-icons/bi";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";

const AppSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setIsOpen(!mobile);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>

            {isMobile && !isOpen && (
                <button
                    onClick={toggleSidebar}
                    className="fixed bottom-6 left-4 z-10 bg-white p-3 shadow-md rounded-full opacity-80 hover:opacity-100 transition-opacity"
                >
                    <HiChevronRight size={24} />
                </button>
            )}


            <div
                className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-transform duration-300 z-50 flex flex-col
        ${isMobile ? (isOpen ? "w-64 translate-x-0" : "-translate-x-full") : "w-64"}
      `}
            >
                <div className="py-8 flex justify-between items-center px-5">
                    <div className="flex items-center gap-3">
                        <img src="/globe.svg" alt="Logo" className="w-6 h-6" />
                        <span className="text-xl font-bold">LOGO</span>
                    </div>

                    {isMobile && (
                        <button onClick={toggleSidebar} className="text-gray-700">
                            <HiChevronLeft size={20} />
                        </button>
                    )}
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
        </>
    );
};

export default AppSidebar;


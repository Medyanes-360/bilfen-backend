// Sidebar.jsx dosyasını güncelleyin
"use client";

import { BookOpen, FileText, GraduationCap, Home, Settings, X } from "lucide-react";
import Link from "next/link";

const Sidebar = ({ mobile = false, closeSidebar = null }) => {
  const menuItems = [
    { name: "Anasayfa", icon: <Home size={20} />, path: "/" },
    {
      name: "İçerik Yönetimi",
      icon: <FileText size={20} />,
      path: "/admin/dashboard/contentManagement",
    },
    // { name: 'Zaman Akışı', icon: <Calendar size={20} />, path: '/timeline' },
    // { name: 'Öğrenciler', icon: <Users size={20} />, path: '/students' },
    // { name: 'Öğretmenler', icon: <BookOpen size={20} />, path: '/teachers' },
    // { name: 'Öğretmen Talepleri', icon: <MessageCircle size={20} />, path: '/teacher-requests' },
    // { name: 'Arşiv', icon: <Archive size={20} />, path: '/archive' },
    // { name: 'İstatistikler', icon: <BarChart2 size={20} />, path: '/statistics' },
    { name: "Öğretmenler", icon: <BookOpen size={20} />, path: "/teachers" },
    { name: "Öğrenciler", icon: <GraduationCap size={20} />, path: "/students" },
    { name: "Ayarlar", icon: <Settings size={20} />, path: "/admin/dashboard/settings" },
  ];

  return (
    <div className="flex flex-col h-full border-r border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-6 bg-indigo-600">
        <div className="flex items-center">
          <span className="text-xl font-semibold text-white">Anaokulu Panel</span>
        </div>
        {mobile && (
          <button onClick={closeSidebar} className="text-white cursor-pointer">
            <X size={24} />
          </button>
        )}
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-indigo-600 group">
              <div className="mr-3 text-gray-500 group-hover:text-indigo-600">{item.icon}</div>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
            A
          </div>
          {/* <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Admin</p>
            <p className="text-xs font-medium text-gray-500">admin@anaokulu.com</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

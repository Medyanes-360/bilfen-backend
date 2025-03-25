"use client";

// Header.jsx - Güncellenmiş üst başlık bileşeni
import {
  Bell,
  Calendar,
  HelpCircle,
  Lightbulb,
  Menu,
  MessageCircle,
  Search,
  Settings,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const Header = ({ toggleSidebar }) => {
  const [notifications] = useState([
    { id: 1, message: "Yeni öğretmen geri bildirimi", time: "5 dakika önce", type: "feedback" },
    { id: 2, message: "İçerik onayı bekliyor", time: "30 dakika önce", type: "approval" },
    { id: 3, message: "Yeni içerik yüklendi", time: "1 saat önce", type: "content" },
    { id: 4, message: "Sistem bakımı planlandı", time: "3 saat önce", type: "system" },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const { data: session } = useSession();

  console.log(session, "session");

  const currentDate = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Bildirim tip ikonunu belirle
  const getNotificationIcon = (type) => {
    switch (type) {
      case "feedback":
        return <MessageCircle size={16} className="text-blue-500" />;
      case "approval":
        return <Bell size={16} className="text-orange-500" />;
      case "content":
        return <Lightbulb size={16} className="text-green-500" />;
      case "system":
        return <Settings size={16} className="text-purple-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  // Hızlı işlem menü öğeleri
  const quickActions = [
    {
      name: "İçerik Ekle",
      icon: <Lightbulb size={16} />,
      action: () => alert("İçerik ekleme sayfası açılıyor..."),
    },
    {
      name: "Zaman Akışını Düzenle",
      icon: <Calendar size={16} />,
      action: () => alert("Zaman akışı sayfası açılıyor..."),
    },
    {
      name: "Geri Bildirimleri Kontrol Et",
      icon: <MessageCircle size={16} />,
      action: () => alert("Geri bildirimler sayfası açılıyor..."),
    },
    {
      name: "Ayarlar",
      icon: <Settings size={16} />,
      action: () => alert("Ayarlar sayfası açılıyor..."),
    },
  ];

  return (
    <header className="sticky top-0 z-20 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        type="button"
        className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
        onClick={toggleSidebar}>
        <span className="sr-only">Menüyü Aç</span>
        <Menu size={24} />
      </button>

      <div className="flex-1 flex justify-between px-4">
        <div className="flex-1 flex items-center">
          <div className="w-full flex items-center md:ml-0">
            <div className="hidden md:block text-sm text-gray-500 mr-4">
              <span className="font-medium">{currentDate}</span>
            </div>

            <div className="w-full max-w-md relative">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                id="search-field"
                className="block w-full h-9 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:placeholder-gray-400 sm:text-sm"
                placeholder="İçerik, öğrenci veya öğretmen ara..."
                type="search"
              />
            </div>
          </div>
        </div>

        <div className="ml-4 flex items-center space-x-4">
          {/* Hızlı İşlemler butonu */}
          <div className="relative">
            <button
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                setShowQuickActions(!showQuickActions);
                setShowNotifications(false);
                setShowUserMenu(false);
              }}>
              <span className="sr-only">Hızlı İşlemler</span>
              <Lightbulb size={20} />
            </button>

            {showQuickActions && (
              <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200 font-medium">
                  Hızlı İşlemler
                </div>
                <div className="py-1">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.action();
                        setShowQuickActions(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-50">
                      <span className="mr-2 text-indigo-600">{action.icon}</span>
                      {action.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Yardım butonu */}
          <button
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => alert("Yardım sayfası açılıyor...")}>
            <span className="sr-only">Yardım</span>
            <HelpCircle size={20} />
          </button>

          {/* Mesajlar butonu */}
          <button
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative">
            <span className="sr-only">Mesajlar</span>
            <MessageCircle size={20} />
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* Bildirimler butonu */}
          <div className="relative">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
                setShowQuickActions(false);
              }}>
              <span className="sr-only">Bildirimleri Göster</span>
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {notifications.length}
              </span>
            </button>

            {/* Bildirimler menüsü */}
            {showNotifications && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200 font-medium flex justify-between items-center">
                  <span>Bildirimler</span>
                  <span className="text-xs text-indigo-600 cursor-pointer hover:text-indigo-800">
                    Tümünü Okundu İşaretle
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <a
                      key={notification.id}
                      href="#"
                      className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-center text-indigo-600 hover:bg-gray-50">
                  Tüm bildirimleri gör
                </a>
              </div>
            )}
          </div>

          {/* Profil menüsü */}
          <div className="relative">
            <button
              type="button"
              className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              id="user-menu"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
                setShowQuickActions(false);
              }}>
              <span className="sr-only">Profil menüsünü aç</span>
              <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
                <User size={18} />
              </div>
            </button>

            {/* Profil dropdown menüsü */}
            {showUserMenu && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                  <p className="font-medium">Admin</p>
                  <p className="text-xs text-gray-500">
                    {session?.user?.email || "admin@bilfen.com"}
                  </p>
                </div>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Profilim
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Ayarlar
                </a>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100 cursor-pointer">
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

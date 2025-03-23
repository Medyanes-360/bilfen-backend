"use client";
import React, { useState, useEffect } from "react";
import { useNotificationStore } from "@/utils";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";

export default function FeedbackDropdown() {
  const close = useNotificationStore((state) => state.close);
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        senderId: "u123",
        sender: "Ayşe Yılmaz",
        message: "Uygulamanın giriş ekranında butonlar hizalanmamış.",
        replyText: "Geri bildiriminiz için teşekkürler, düzelttik.",
        isReplied: true,
        timestamp: "2025-03-22T14:25:00Z",
        project: "Mobil Eğitim Uygulaması",
        showReply: false,
      },
      {
        id: 2,
        senderId: "u456",
        sender: "Mehmet Can",
        message: "Sesli anlatımlar çalışmıyor.",
        replyText: "",
        isReplied: false,
        timestamp: "2025-03-22T15:12:00Z",
        project: "Mobil Eğitim Uygulaması",
        showReply: false,
      },
      {
        id: 3,
        senderId: "u789",
        sender: "Zeynep Demir",
        message: "Renkler erişilebilirlik kurallarına uygun değil.",
        replyText: "",
        isReplied: false,
        timestamp: "2025-03-21T10:45:00Z",
        project: "Admin Panel Tasarımı",
        showReply: false,
      },
      {
        id: 4,
        senderId: "u234",
        sender: "Ali Kaya",
        message: "Kayıt formu sonrası hata alıyorum.",
        replyText: "",
        isReplied: false,
        timestamp: "2025-03-20T08:15:00Z",
        project: "Kullanıcı Kayıt Modülü",
        showReply: false,
      },
      {
        id: 5,
        senderId: "u567",
        sender: "Elif Koç",
        message: "Profil resmi yükleme çalışmıyor.",
        replyText: "",
        isReplied: false,
        timestamp: "2025-03-19T19:30:00Z",
        project: "Profil Yönetimi",
        showReply: false,
      },
    ];

    setNotifications(dummyData);
  }, []);

  const visibleNotifications = notifications
    .filter((n) => !n.isReplied)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div
      className={`absolute z-50 mt-[17px] right-2 sm:right-4 md:right-6 lg:right-0 w-[350px] max-w-[90vw] flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-lg transition-all 
      ${visibleNotifications.length === 0 ? "min-h-[200px]" : "h-[480px]"}`}
    >
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
        <h5 className="text-base font-semibold text-gray-800">Bildirimler</h5>
        <button
          onClick={close}
          className="text-gray-500 hover:text-gray-700 transition text-xl cursor-pointer"
        >
          <IoMdClose />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {visibleNotifications.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-12">
            Gösterilecek bildirim yok.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {visibleNotifications.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
              >
                <div className="flex flex-col text-sm text-gray-700">
                  <span className="font-semibold">{item.sender}</span>
                  <p className="font-normal leading-snug break-words">
                    {item.message}
                  </p>
                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(item.timestamp).toLocaleString("tr-TR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="pl-1 mt-1">
                  {!item.showReply ? (
                    <button
                      onClick={() => {
                        const updated = notifications.map((n) =>
                          n.id === item.id ? { ...n, showReply: true } : n
                        );
                        setNotifications(updated);
                      }}
                      className="text-xs border border-blue-600 text-blue-600 bg-white px-4 py-1.5 rounded-full hover:bg-blue-50 transition cursor-pointer"
                    >
                      Cevapla
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2 mt-2">
                      <textarea
                        rows={2}
                        value={item.replyText}
                        onChange={(e) => {
                          const updated = notifications.map((n) =>
                            n.id === item.id
                              ? { ...n, replyText: e.target.value }
                              : n
                          );
                          setNotifications(updated);
                        }}
                        placeholder="Yanıtınızı yazın..."
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!item.replyText.trim()) return;
                            const updated = notifications.map((n) =>
                              n.id === item.id
                                ? {
                                    ...n,
                                    isReplied: true,
                                    showReply: false,
                                  }
                                : n
                            );
                            setNotifications(updated);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded-full cursor-pointer transition"
                        >
                          Gönder
                        </button>
                        <button
                          onClick={() => {
                            const updated = notifications.map((n) =>
                              n.id === item.id
                                ? {
                                    ...n,
                                    showReply: false,
                                    replyText: "",
                                  }
                                : n
                            );
                            setNotifications(updated);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-1.5 rounded-full transition cursor-pointer"
                        >
                          Vazgeç
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {visibleNotifications.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <button
            onClick={() => {
              close();
              router.push("/allNotifications");
            }}
            className="block w-full text-center text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
          >
            Tüm Bildirimleri Gör
          </button>
        </div>
      )}
    </div>
  );
}

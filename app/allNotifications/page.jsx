"use client";

import React, { useState, useEffect } from "react";
import { FaRegThumbsUp } from "react-icons/fa6";
import { HiArrowTurnDownRight } from "react-icons/hi2";

export default function AllNotificationsPage() {
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
        timestamp: "2025-02-22T14:25:00Z",
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
        timestamp: "2025-02-22T15:12:00Z",
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
        timestamp: "2025-02-21T10:45:00Z",
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

  const handleToggleReply = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, showReply: true } : n
    );
    setNotifications(updated);
  };

  const handleReplyChange = (id, text) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, replyText: text } : n
    );
    setNotifications(updated);
  };

  const handleSendReply = (id) => {
    const current = notifications.find((n) => n.id === id);
    if (!current.replyText.trim()) return;

    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isReplied: true, showReply: false } : n
    );
    setNotifications(updated);
  };

  const handleCancelReply = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, showReply: false, replyText: "" } : n
    );
    setNotifications(updated);
  };

  const notReplied = notifications
    .filter((n) => !n.isReplied)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const replied = notifications
    .filter((n) => n.isReplied)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const renderNotification = (item) => (
    <li
      key={item.id}
      className="w-full flex flex-col gap-3 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition shadow-sm"
    >
      <div className="text-sm text-gray-700">
        <span className="font-semibold">{item.sender}</span>
        <p className="text-sm mt-1 leading-snug">{item.message}</p>

        {item.isReplied && item.replyText && (
          <div className="flex items-start gap-2 text-sm text-gray-500 mt-3">
            <HiArrowTurnDownRight className="mt-0.5 shrink-0" />
            <p className="leading-snug">{item.replyText}</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
          <span className="text-xs text-gray-500">
            {new Date(item.timestamp).toLocaleString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <div>
            {item.isReplied ? (
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full border border-green-500 text-green-600"
                title="Cevaplandı"
              >
                <FaRegThumbsUp size={14} />
              </div>
            ) : (
              !item.showReply && (
                <button
                  onClick={() => handleToggleReply(item.id)}
                  className="text-xs border border-blue-600 text-blue-600 bg-white px-4 py-1.5 rounded-full hover:bg-blue-50 transition cursor-pointer"
                >
                  Cevapla
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {!item.isReplied && item.showReply && (
        <div className="flex flex-col gap-2 mt-2">
          <textarea
            rows={3}
            value={item.replyText}
            onChange={(e) => handleReplyChange(item.id, e.target.value)}
            placeholder="Yanıtınızı yazın..."
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleSendReply(item.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded-full transition cursor-pointer"
            >
              Gönder
            </button>
            <button
              onClick={() => handleCancelReply(item.id)}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-1.5 rounded-full transition cursor-pointer"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}
    </li>
  );

  return (
    <div className="w-full py-6 px-0 sm:px-4 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-lg font-semibold text-gray-600">
          Tüm Bildirimler
        </h1>
        <span className="text-sm text-blue-600 font-medium">
          Cevaplanmayan Bildirimler ({notReplied.length})
        </span>
      </div>


      <ul className="flex flex-col gap-4 mb-10">
        {notReplied.map(renderNotification)}
      </ul>


      {replied.length > 0 && (
        <>
          <h2 className="text-sm font-medium text-gray-500 mb-2">
            Yanıtlanan Bildirimler
          </h2>
          <ul className="flex flex-col gap-4">
            {replied.map(renderNotification)}
          </ul>
        </>
      )}
    </div>
  );
}

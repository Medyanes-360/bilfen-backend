"use client";

import Image from "next/image";
import React from "react";

export default function AllNotificationsPage() {
  return (
    <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">Tüm Bildirimler</h1>

      <ul className="flex flex-col gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <li
            key={i}
            className="w-full flex gap-4 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition"
          >
            <div className="relative w-10 h-10">
              <Image
                width={40}
                height={40}
                src="/globe.svg"
                alt="Notification"
                className="rounded-full object-cover w-full h-full"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-green-500" />
            </div>

            <div className="flex flex-col justify-center text-sm text-gray-700">
              <p className="mb-1 leading-snug">
                <span className="font-medium">User {i + 1}</span> requests permission to change{" "}
                <span className="font-medium">Project - Nganter App</span>
              </p>
              <span className="text-xs text-gray-500 flex items-center gap-2">
                <span>Project</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                <span>{(i + 1) * 3} min ago</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

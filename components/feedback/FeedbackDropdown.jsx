"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useNotificationStore } from "@/utils";
import { useRouter } from "next/navigation";


export default function FeedbackDropdown() {
  const close = useNotificationStore((state) => state.close);
  const router = useRouter();

  return (
    <div
      className={`
        absolute z-50 mt-[17px]
        right-2 sm:right-4 md:right-6 lg:right-0
        w-[350px] max-w-[90vw]
        flex flex-col
        h-[480px]
        rounded-2xl border border-gray-200 bg-white p-4 shadow-lg
      `}
    >
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
        <h5 className="text-base font-semibold text-gray-800">Bildirimler</h5>
        <button
          onClick={close}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <svg
            className="fill-current"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L12 10.9393L16.7186 6.22078C17.0115 5.92789 17.4863 5.92788 17.7792 6.22078C18.0721 6.51367 18.0721 6.98855 17.7792 7.28144L13.0607 12L17.7792 16.7186C18.0721 17.0115 18.0721 17.4863 17.7792 17.7792C17.4863 18.0721 17.0115 18.0721 16.7186 17.7792L12 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9393 12L6.21967 7.28131Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <ul className="flex flex-col gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
            >
              <span className="relative w-8 h-8">
                <Image
                  width={40}
                  height={40}
                  src="/globe.svg"
                  alt="Notification"
                  className="rounded-full w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-green-500"></span>
              </span>

              <div className="flex flex-col text-sm text-gray-700">
                <p>
                  <span className="font-medium">User {i + 1}</span> requests permission to change{" "}
                  <span className="font-medium">Project - Nganter App</span>
                </p>
                <span className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full" />
                  <span>{(i + 1) * 3} min ago</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-3 border-t border-gray-200">
        <button
          onClick={() => {
            close(); 
            router.push("/allNotifications"); 
          }}
          className="block w-full text-center text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
        >
          Tüm Bildirimleri Gör
        </button>
      </div>
    </div>
  );
}

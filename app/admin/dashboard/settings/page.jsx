"use client";

import { useState } from "react";
import Link from "next/link"; 

const dayOptions = [1, 3, 5, 7, 9, 12];

export default function Settings() {
  const [studentDays, setStudentDays] = useState(5);
  const [teacherDays, setTeacherDays] = useState(7);
  const [confirmedStudentDays, setConfirmedStudentDays] = useState(null);
  const [confirmedTeacherDays, setConfirmedTeacherDays] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <Link
        href="/"
        className="absolute top-6 left-6 border border-indigo-500 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        Geri
      </Link>

      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">Erişim Ayarları</h1>

        {/* Öğrenci Ayarı */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Öğrenciler geçmişi kaç gün görmeli?
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={studentDays}
              onChange={(e) => setStudentDays(Number(e.target.value))}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day} gün
                </option>
              ))}
            </select>
            <button
              onClick={() => setConfirmedStudentDays(studentDays)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition cursor-pointer"
            >
              Onayla
            </button>
          </div>
          {confirmedStudentDays !== null && (
            <p className="mt-4 text-sm text-green-600">
              Öğrenciler {confirmedStudentDays} gün öncesine kadar geçmişi görüntüleyebilir.
            </p>
          )}
        </div>

        <hr className="my-6 border-gray-300" />

        {/* Öğretmen Ayarı */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Öğretmenler geçmişi kaç gün görmeli?
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={teacherDays}
              onChange={(e) => setTeacherDays(Number(e.target.value))}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day} gün
                </option>
              ))}
            </select>
            <button
              onClick={() => setConfirmedTeacherDays(teacherDays)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
            >
              Onayla
            </button>
          </div>
          {confirmedTeacherDays !== null && (
            <p className="mt-4 text-sm text-green-600">
              Öğretmenler {confirmedTeacherDays} gün öncesine kadar geçmişi görüntüleyebilir.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

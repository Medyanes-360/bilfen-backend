"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useAccessSettings from "@/lib/store/useAccessSettings";
import { ArrowLeft } from "lucide-react";

const dayOptions = [1, 3, 5, 7, 9, 12];

export default function Settings() {
  const {
    studentDays,
    teacherDays,
    teacherDaysFuture,
    isLoaded,
    fetchAccessSettings,
    setStudentDays,
    setTeacherDays,
    setTeacherDaysFuture,
  } = useAccessSettings();

  const [tempStudentDays, setTempStudentDays] = useState(5);
  const [tempTeacherDays, setTempTeacherDays] = useState(7);
  const [tempTeacherDaysFuture, setTempTeacherDaysFuture] = useState(0);

  const [showStudentMessage, setShowStudentMessage] = useState(false);
  const [showTeacherMessage, setShowTeacherMessage] = useState(false);
  const [showFutureMessage, setShowFutureMessage] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      fetchAccessSettings();
    } else {
      setTempStudentDays(studentDays);
      setTempTeacherDays(teacherDays);
      setTempTeacherDaysFuture(teacherDaysFuture);
    }
  }, [isLoaded, studentDays, teacherDays, teacherDaysFuture, fetchAccessSettings]);

  const handleStudentConfirm = () => {
    setStudentDays(tempStudentDays);
    setShowStudentMessage(true);
    setTimeout(() => setShowStudentMessage(false), 4000);
  };

  const handleTeacherConfirm = () => {
    setTeacherDays(tempTeacherDays);
    setShowTeacherMessage(true);
    setTimeout(() => setShowTeacherMessage(false), 4000);
  };

  const handleFutureConfirm = () => {
    setTeacherDaysFuture(tempTeacherDaysFuture);
    setShowFutureMessage(true);
    setTimeout(() => setShowFutureMessage(false), 4000);
  };

  if (!isLoaded) return <p>Yükleniyor...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-4">
      <Link
        href="/"
        className="absolute top-3 left-6   text-gray-700  rounded-lg hover:text-gray-600 transition"
      >
       <ArrowLeft/>
      </Link>

      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Erişim Ayarları
        </h1>

        {/* Öğrenci Ayarı */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Öğrenciler geçmişi kaç gün görmeli?
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={tempStudentDays}
              onChange={(e) => setTempStudentDays(Number(e.target.value))}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2"
            >
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day} gün
                </option>
              ))}
            </select>
            <button
              onClick={handleStudentConfirm}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
            >
              Onayla
            </button>
          </div>
          {showStudentMessage && (
            <p className="mt-4 text-sm text-green-600">
              Öğrenciler {studentDays} gün öncesine kadar geçmişi görüntüleyebilir.
            </p>
          )}
        </div>

        <hr className="my-6 border-gray-300" />

        {/* Öğretmen Ayarı */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Öğretmenler geçmişi kaç gün görmeli?
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={tempTeacherDays}
              onChange={(e) => setTempTeacherDays(Number(e.target.value))}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2"
            >
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day} gün
                </option>
              ))}
            </select>
            <button
              onClick={handleTeacherConfirm}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
            >
              Onayla
            </button>
          </div>
          {showTeacherMessage && (
            <p className="mt-4 text-sm text-green-600">
              Öğretmenler {teacherDays} gün öncesine kadar geçmişi görüntüleyebilir.
            </p>
          )}
        </div>

        <hr className="my-6 border-gray-300" />

        {/* Geleceğe Dönük Öğretmen Ayarı */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Öğretmenler geleceği kaç gün öncesinden görebilmeli?
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={tempTeacherDaysFuture}
              onChange={(e) => setTempTeacherDaysFuture(Number(e.target.value))}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2"
            >
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day} gün
                </option>
              ))}
            </select>
            <button
              onClick={handleFutureConfirm}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
            >
              Onayla
            </button>
          </div>
          {showFutureMessage && (
            <p className="mt-4 text-sm text-green-600">
              Öğretmenler {teacherDaysFuture} gün sonrasına kadar içerikleri görebilir.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

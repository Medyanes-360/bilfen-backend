"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useAccessSettings from "@/lib/store/useAccessSettings";
import { ArrowLeft } from "lucide-react";
import SettingSelect from "@/components/Settings/SettingSelect";

export default function SettingsPage() {
  const {
    studentDays,
    studentDaysFuture,
    teacherDays,
    teacherDaysFuture,
    startedDate,
    endDate,
    isLoaded,
    fetchAccessSettings,
    updateAllSettings,
  } = useAccessSettings();

  const [tempStudentDays, setTempStudentDays] = useState(5);
  const [tempStudentDaysFuture, setTempStudentDaysFuture] = useState(0);
  const [tempTeacherDays, setTempTeacherDays] = useState(7);
  const [tempTeacherDaysFuture, setTempTeacherDaysFuture] = useState(0);
  const [tempStartedDate, setTempStartedDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      fetchAccessSettings();
    } else {
      setTempStudentDays(studentDays);
      setTempStudentDaysFuture(studentDaysFuture);
      setTempTeacherDays(teacherDays);
      setTempTeacherDaysFuture(teacherDaysFuture);
      setTempStartedDate(startedDate?.split("T")[0] || "");
      setTempEndDate(endDate?.split("T")[0] || "");
    }
  }, [isLoaded]);

  const handleSubmit = async () => {
    await updateAllSettings({
      studentDays: tempStudentDays,
      studentDaysFuture: tempStudentDaysFuture,
      teacherDays: tempTeacherDays,
      teacherDaysFuture: tempTeacherDaysFuture,
      startedDate: tempStartedDate,
      endDate: tempEndDate,
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (!isLoaded) return <p className="text-center mt-10">Yükleniyor...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-4">
      <Link
        href="/"
        className="absolute top-3 left-6 text-gray-700 hover:text-gray-600 transition"
      >
        <ArrowLeft />
      </Link>

      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Erişim Ayarları
        </h1>

        <SettingSelect
          label="Öğrenciler geçmişi kaç gün görmeli?"
          value={tempStudentDays}
          onChange={setTempStudentDays}
        />

        <SettingSelect
          label="Öğrenciler geleceği kaç gün öncesinden görebilmeli?"
          value={tempStudentDaysFuture}
          onChange={setTempStudentDaysFuture}
        />

        <SettingSelect
          label="Öğretmenler geçmişi kaç gün görmeli?"
          value={tempTeacherDays}
          onChange={setTempTeacherDays}
        />

        <SettingSelect
          label="Öğretmenler geleceği kaç gün öncesinden görebilmeli?"
          value={tempTeacherDaysFuture}
          onChange={setTempTeacherDaysFuture}
        />

        <div>
          <label className="block text-sm font-semibold mb-1">
            Erişim Başlangıç Tarihi:
          </label>
          <input
            type="date"
            value={tempStartedDate}
            onChange={(e) => setTempStartedDate(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Erişim Bitiş Tarihi:
          </label>
          <input
            type="date"
            value={tempEndDate}
            onChange={(e) => setTempEndDate(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Tüm Ayarları Kaydet
        </button>

        {success && (
          <p className="text-green-600 text-sm mt-2 text-center">
            ✅ Ayarlar başarıyla güncellendi.
          </p>
        )}
      </div>
    </div>
  );
}

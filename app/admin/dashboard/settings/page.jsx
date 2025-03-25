'use client';

import { useState,useEffect } from 'react';
import useAccessSettings from '@/lib/store/useAccessSettings';


export default function SettingsPage() {
  const {
    studentDays,
    teacherDays,
    setStudentDays,
    setTeacherDays,
    fetchAccessSettings //  eklenen fonksiyon
  } = useAccessSettings();

  const dayOptions = [1, 3, 5, 7, 9, 12]; 

  const [localStudentDays, setLocalStudentDays] = useState(studentDays);
  const [localTeacherDays, setLocalTeacherDays] = useState(teacherDays);

  //  Sayfa ilk yüklendiğinde veritabanından ayarları al
  useEffect(() => {
    fetchAccessSettings();
  }, []);

  //  store güncellenince local stateleri de güncelle
  useEffect(() => {
    setLocalStudentDays(studentDays);
  }, [studentDays]);

  useEffect(() => {
    setLocalTeacherDays(teacherDays);
  }, [teacherDays]);

  const handleStudentConfirm = () => {
    setStudentDays(localStudentDays);
  };

  const handleTeacherConfirm = () => {
    setTeacherDays(localTeacherDays);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">Erişim Ayarları</h1>

        {/* Öğrenci Ayarı */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Öğrenciler geçmişi kaç gün görmeli?
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={localStudentDays}
              onChange={(e) => setLocalStudentDays(Number(e.target.value))}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day} gün
                </option>
              ))}
            </select>
            <button
              onClick={handleStudentConfirm}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition cursor-pointer"
            >
              Onayla
            </button>
          </div>
          <p className="mt-2 text-sm text-green-600">
            Öğrenciler {studentDays} gün öncesine kadar geçmişi görebilir.
          </p>
        </div>

        <hr className="my-6 border-gray-300" />

        {/* Öğretmen Ayarı */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Öğretmenler geçmişi kaç gün görmeli?
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={localTeacherDays}
              onChange={(e) => setLocalTeacherDays(Number(e.target.value))}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day} gün
                </option>
              ))}
            </select>
            <button
              onClick={handleTeacherConfirm}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
            >
              Onayla
            </button>
          </div>
          <p className="mt-2 text-sm text-green-600">
            Öğretmenler {teacherDays} gün öncesine kadar geçmişi görebilir.
          </p>
        </div>
      </div>
    </div>
  );
}

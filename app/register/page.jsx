"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

// SearchParams için ayrı bir bileşen oluşturalım
function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role");

    if (roleParam === "TEACHER") {
      setRole("TEACHER");
    } else if (roleParam === "STUDENT") {
      setRole("STUDENT");
    }
  }, []);

  // Ortak alanlar
  const [formData, setFormData] = useState({
    tcNo: "",
    name: "",
    surname: "",
    password: "",
    isActive: true,
  });

  const [teacherData, setTeacherData] = useState({
    email: "",
    branch: "MATEMATIK",
    phone: "",
    experience: "",
  });

  const [studentData, setStudentData] = useState({
    studentNumber: "",
    grade: "",
    classroom: "",
    parentName: "",
    parentPhone: "",
  });

  const handleCommonChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTeacherChange = (e) => {
    const { name, value } = e.target;
    setTeacherData({
      ...teacherData,
      [name]: value,
    });
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Role göre veri hazırla
      const data = {
        ...formData,
        role,
      };

      if (role === "TEACHER") {
        Object.assign(data, teacherData);
      } else {
        Object.assign(data, studentData);
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Kayıt işlemi başarısız oldu");
      }

      setMessage({
        text: `${role === "TEACHER" ? "Öğretmen" : "Öğrenci"} başarıyla kaydedildi`,
        type: "success",
      });

      // Formu sıfırla
      setFormData({
        tcNo: "",
        name: "",
        surname: "",
        password: "",
        isActive: true,
      });

      if (role === "TEACHER") {
        setTeacherData({
          email: "",
          branch: "MATEMATIK",
          phone: "",
          experience: "",
        });
      } else {
        setStudentData({
          studentNumber: "",
          grade: "",
          classroom: "",
          parentName: "",
          parentPhone: "",
        });
      }
    } catch (error) {
      setMessage({
        text: error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
     <Link
        href="/"
        className="absolute top-2 left-2  text-gray-700  ">
        <ArrowLeft/>
      </Link>
      <div className="max-w-4xl mx-auto px-6 py-10 rounded-lg shadow-md min-h-screen bg-white flex flex-col justify-start overflow-y-auto">

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Yeni Kullanıcı Kaydı</h1>

        {message.text && (
          <div
            className={`p-4 mb-6 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
            {message.text}
          </div>
        )}

        <div className="flex justify-center space-x-4 mb-6">
          <button
            type="button"
            onClick={() => setRole("STUDENT")}
            className={`px-4 py-2 rounded-md transition-colors ${
              role === "STUDENT"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}>
            Öğrenci
          </button>
          <button
            type="button"
            onClick={() => setRole("TEACHER")}
            className={`px-4 py-2 rounded-md transition-colors ${
              role === "TEACHER"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}>
            Öğretmen
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {role === "TEACHER" ? "Öğretmen Bilgileri" : "Öğrenci Bilgileri"}
            </h2>

            {/* Ortak Alanlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="tcNo" className="block text-sm font-medium text-gray-700 mb-1">
                  TC Kimlik No
                </label>
                <input
                  id="tcNo"
                  name="tcNo"
                  type="text"
                  value={formData.tcNo}
                  onChange={handleCommonChange}
                  required
                  maxLength="11"
                  minLength="11"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Ad
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleCommonChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                  Soyad
                </label>
                <input
                  id="surname"
                  name="surname"
                  type="text"
                  value={formData.surname}
                  onChange={handleCommonChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleCommonChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleCommonChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Aktif Kullanıcı</span>
                </label>
              </div>
            </div>
          </div>

          {/* Öğretmen Özel Alanları */}
          {role === "TEACHER" && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Öğretmen Detayları</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={teacherData.email}
                    onChange={handleTeacherChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                    Branş
                  </label>
                  <select
                    id="branch"
                    name="branch"
                    value={teacherData.branch}
                    onChange={handleTeacherChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="MATEMATIK">Matematik</option>
                    <option value="TURKCE">Türkçe</option>
                    <option value="FEN_BILGISI">Fen Bilgisi</option>
                    <option value="SOSYAL_BILGILER">Sosyal Bilgiler</option>
                    <option value="INGILIZCE">İngilizce</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={teacherData.phone}
                    onChange={handleTeacherChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Deneyim (Yıl)
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    max="50"
                    value={teacherData.experience}
                    onChange={handleTeacherChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Öğrenci Özel Alanları */}
          {role === "STUDENT" && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Öğrenci Detayları</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="studentNumber"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Öğrenci Numarası
                  </label>
                  <input
                    id="studentNumber"
                    name="studentNumber"
                    type="text"
                    value={studentData.studentNumber}
                    onChange={handleStudentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                    Sınıf
                  </label>
                  <input
                    id="grade"
                    name="grade"
                    type="number"
                    min="1"
                    max="12"
                    value={studentData.grade}
                    onChange={handleStudentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="classroom"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Şube
                  </label>
                  <input
                    id="classroom"
                    name="classroom"
                    type="text"
                    value={studentData.classroom}
                    onChange={handleStudentChange}
                    placeholder="Örn: A, B, C"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="parentName"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Veli Adı
                  </label>
                  <input
                    id="parentName"
                    name="parentName"
                    type="text"
                    value={studentData.parentName}
                    onChange={handleStudentChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="parentPhone"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Veli Telefonu
                  </label>
                  <input
                    id="parentPhone"
                    name="parentPhone"
                    type="tel"
                    value={studentData.parentPhone}
                    onChange={handleStudentChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}>
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminRegister() {
  return (
    <Suspense
      fallback={<div className="flex justify-center items-center h-screen">Yükleniyor...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

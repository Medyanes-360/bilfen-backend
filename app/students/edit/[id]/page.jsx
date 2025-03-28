"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function EditStudent({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    tcNo: "",
    name: "",
    surname: "",
    studentNumber: "",
    grade: "",
    classroom: "",
    parentName: "",
    parentPhone: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${id}`);
        if (!response.ok) {
          throw new Error("Öğrenci bilgileri alınamadı");
        }
        const student = await response.json();
        setFormData({
          tcNo: student.tcNo || "",
          name: student.name || "",
          surname: student.surname || "",
          studentNumber: student.studentNumber || "",
          grade: student.grade || "",
          classroom: student.classroom || "",
          parentName: student.parentName || "",
          parentPhone: student.parentPhone || "",
          isActive: student.isActive !== undefined ? student.isActive : true,
        });
      } catch (error) {
        setMessage({
          text: `Hata: ${error.message}`,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Güncelleme sırasında bir hata oluştu");
      }

      setMessage({
        text: "Öğrenci bilgileri başarıyla güncellendi",
        type: "success",
      });

      // 2 saniye sonra öğrenciler sayfasına yönlendir
      setTimeout(() => {
        router.push("/students");
      }, 2000);
    } catch (error) {
      setMessage({
        text: error.message,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Link
        href="/students"
        className="absolute top-6 left-6 border border-indigo-500 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition">
        Geri
      </Link>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-16">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Öğrenci Bilgilerini Düzenle
        </h1>

        {message.text && (
          <div
            className={`p-4 mb-6 rounded-md ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tcNo" className="block text-sm font-medium text-gray-700 mb-1">
                TC Kimlik No
              </label>
              <input
                id="tcNo"
                name="tcNo"
                type="text"
                value={formData.tcNo}
                onChange={handleChange}
                required
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
                onChange={handleChange}
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
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="studentNumber"
                className="block text-sm font-medium text-gray-700 mb-1">
                Öğrenci No
              </label>
              <input
                id="studentNumber"
                name="studentNumber"
                type="text"
                value={formData.studentNumber}
                onChange={handleChange}
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
                value={formData.grade}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="classroom" className="block text-sm font-medium text-gray-700 mb-1">
                Şube
              </label>
              <input
                id="classroom"
                name="classroom"
                type="text"
                maxLength="1"
                value={formData.classroom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-1">
                Veli Adı
              </label>
              <input
                id="parentName"
                name="parentName"
                type="text"
                value={formData.parentName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Veli Telefonu
              </label>
              <input
                id="parentPhone"
                name="parentPhone"
                type="tel"
                value={formData.parentPhone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Aktif
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}>
              {submitting ? "Güncelleniyor..." : "Güncelle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";
import { contentTypes, ageGroups } from '../app/constants/mockData';
import { useState } from "react";
import { Upload, Tag } from "lucide-react";
import isValidDate from "@/components/dateValidation"
import useToastStore from '@/lib/store/toast';
export default function SingleContentForm({
  setIsModalOpen,
  currentContent,
  setCurrentContent,
  setContents,
  handleTypeChange,
  branchOptions = [],
  handleDragLeave,
  handleDragOver,
  handleDrop,
  handleFileChange,
  selectedFile,
  setSelectedFile,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isWeeklyContentChecked, setIsWeeklyContentChecked] = useState(
    !!currentContent?.isWeeklyContent
  );
    const [studentDate, setStudentDate] = useState(currentContent?.publishDateStudent
      ? new Date(currentContent.publishDateStudent).toISOString().split("T")[0]
      : "");
    
    const [teacherDate, setTeacherDate] = useState(currentContent?.publishDateTeacher
      ? new Date(currentContent.publishDateTeacher).toISOString().split("T")[0]
      : "");
      const { showToast } = useToastStore();


  const uploadFileToR2 = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/file/upload", {
      method: "POST",
      body: formData,
    });

    console.log("Upload fetch status:", res.status);
    if (!res.ok) throw new Error("Dosya yüklenemedi");

    const text = await res.text();
    console.log("Upload response body (as text):", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Geçersiz JSON:", err);
      throw new Error("Sunucu geçersiz bir JSON döndürdü");
    }
    const uploadedFile = data?.file;

    if (!uploadedFile?.url) {
      console.error("URL yok:", uploadedFile);
      throw new Error("Yüklenen dosya URL'si alınamadı");
    }

    const fileUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${uploadedFile.url}`;
    return { fileUrl };
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData(e.target);


    const tags = formData
      .get("tags")
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) || [];

    let fileUrl = currentContent?.fileUrl || null;

    if (selectedFile) {
      try {
        console.log("Dosya yükleniyor:", selectedFile);
        const uploadResult = await uploadFileToR2(selectedFile);
        fileUrl = uploadResult.fileUrl;
        console.log("Dosya yüklendi, URL:", fileUrl);
      } catch (err) {
        console.error("Dosya yüklenirken hata oluştu:", err);
        alert("Dosya yüklenirken hata oluştu.");
        setIsUploading(false);
        return;
      }
    }

    if (!formData.get("title") || !fileUrl) {
      alert("Lütfen başlık ve içerik dosyası ekleyin.");
      setIsUploading(false);
      return;
    }

    //  Güvenli tarih fonksiyonu
    const safeDate = (raw) => {
      if (!raw || typeof raw !== "string" || raw.trim() === "") return null;
      const date = new Date(raw);
      return isNaN(date.getTime()) ? null : date;
    };

    const payload = {
      title: formData.get("title") || null,
      type: formData.get("type") || null,
      branch: formData.get("branch") || null,
      ageGroup: formData.get("ageGroup") || null,
      publishDateStudent: safeDate(formData.get("publishDateStudent")),
      publishDateTeacher: safeDate(formData.get("publishDateTeacher")),
      isWeeklyContent: formData.get("isWeeklyContent") === "on",
      weeklyContentStartDate: isWeeklyContent && formData.get("weeklyContentStartDate") ? safeDate(formData.get("weeklyContentStartDate")) : null,
      weeklyContentEndDate: isWeeklyContent && formData.get("weeklyContentEndDate") ? safeDate(formData.get("weeklyContentEndDate")) : null,
      endDateStudent: safeDate(formData.get("weeklyContentEndDate")),
      endDateTeacher: safeDate(formData.get("weeklyContentEndDate")),
      description: formData.get("description") || null,
      tags,
      fileUrl,
    };

    console.log("Gönderilen payload:", payload);

    try {
      let res;
      if (currentContent) {
        res = await fetch(`/api/contents/${currentContent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Güncelleme başarısız");

        setContents((prev) =>
          prev.map((c) => (c.id === currentContent.id ? { ...c, ...payload } : c))
        );
      } else {
        res = await fetch("/api/contents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        console.log("POST isteği sonucu:", res.status);
        const newContent = await res.json();
        console.log("Yeni içerik:", newContent);
        setContents((prev) => [newContent, ...prev]);
      }
    } catch (error) {
      console.error("İçerik kaydedilemedi:", error);
      alert("İçerik kaydedilemedi");
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setCurrentContent(null);
      setIsModalOpen(false);
    }
  };








  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {currentContent ? "İçerik Düzenle" : "Yeni İçerik Ekle"}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {/* İçerik Başlığı */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    İçerik Başlığı
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    defaultValue={currentContent?.title || ""}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                {/* İçerik Türü */}
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    İçerik Türü
                  </label>
                  <select
                    id="type"
                    name="type"
                    defaultValue={currentContent?.type || ""}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={handleTypeChange}
                  >
                    <option value="">Seçiniz</option>
                    {contentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Branş */}
                <div>
                  <label
                    htmlFor="branch"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Branş
                  </label>
                  <select
                    id="branch"
                    name="branch"
                    defaultValue={currentContent?.branch || ""}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Seçiniz</option>
                    {branchOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Yaş Grubu */}
                <div>
                  <label
                    htmlFor="ageGroup"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Yaş Grubu
                  </label>
                  <select
                    id="ageGroup"
                    name="ageGroup"
                    defaultValue={currentContent?.ageGroup || ""}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Seçiniz</option>
                    {ageGroups.map((age) => (
                      <option key={age.value} value={age.value}>
                        {age.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Yayın Tarihleri */}
                {!isWeeklyContentChecked && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Öğrenci Yayın Tarihi */}
                    <div>
                      <label htmlFor="publishDateStudent" className="block text-sm font-medium text-gray-700">
                        Öğrenci Yayın Tarihi
                      </label>
                      <input
                        type="date"
                        name="publishDateStudent"
                        id="publishDateStudent"
                        min={new Date().toISOString().split("T")[0]} 
                        value={studentDate}
                        onChange={(e) => setStudentDate(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                      />
                    </div>

                    {/* Öğretmen Yayın Tarihi */}
                    <div>
                      <label htmlFor="publishDateTeacher" className="block text-sm font-medium text-gray-700">
                        Öğretmen Yayın Tarihi
                      </label>
                      <input
                        type="date"
                        name="publishDateTeacher"
                        id="publishDateTeacher"
                        min={new Date().toISOString().split("T")[0]} 
                        value={teacherDate}
                     
                        onChange={(e) => {
                          const selectedDate = e.target.value;
                          if (studentDate) {
                            const student = new Date(studentDate);
                            const teacher = new Date(selectedDate);
                            if (teacher > student) {
                              showToast("Öğretmen yayın tarihi, öğrenci tarihinden sonra olamaz!", "error");
                              setTeacherDate("");
                              return;
                            }
                          }
                        
                          setTeacherDate(selectedDate);
                        }}
                        
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                      />
                    </div>

                  </div>
                )}


                {/* Ek Materyal Seçeneği */}
                <div className="mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isWeeklyContent"
                      id="isWeeklyContent"
                      checked={isWeeklyContentChecked}
                      onChange={(e) => {
                        setIsWeeklyContentChecked(e.target.checked);
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      Ek Materyal
                    </span>
                  </label>
                </div>

                {/* Ek Materyal Tarih Aralığı */}
                {isWeeklyContentChecked && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Başlangıç Tarihi */}
                      <div>
                        <label
                          htmlFor="weeklyContentStartDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Başlangıç Tarihi
                        </label>
                        <input
                          type="date"
                          name="weeklyContentStartDate"
                          id="weeklyContentStartDate"
                          min={new Date().toISOString().split("T")[0]} 
                          defaultValue={
                            isValidDate(currentContent?.weeklyContentStartDate)
                              ? new Date(currentContent.weeklyContentStartDate)
                                .toISOString()
                                .split("T")[0]
                              : ""
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      {/* Bitiş Tarihi */}
                      <div>
                        <label
                          htmlFor="weeklyContentEndDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Bitiş Tarihi
                        </label>
                        <input
                          type="date"
                          name="weeklyContentEndDate"
                          id="weeklyContentEndDate"
                          defaultValue={
                            isValidDate(currentContent?.weeklyContentEndDate)
                              ? new Date(currentContent.weeklyContentEndDate)
                                .toISOString()
                                .split("T")[0]
                              : ""
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Dosya Yükleme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    İçerik Dosyası
                  </label>

                  {currentContent?.fileUrl ? (
                    <div className="mt-2 text-sm text-gray-700 space-y-1">
                      <p className="font-medium">Yüklü dosya:</p>
                      <p className="text-sm font-medium text-green-600 break-all ">
                        {currentContent.fileUrl.split("/").pop()}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          // sadece UI'da fileUrl'i sıfırla → böylece drag-drop alanı tekrar görünür
                          setCurrentContent((prev) => ({
                            ...prev,
                            fileUrl: null,
                          }));
                          setSelectedFile(null); // önceki yükleme temizlensin
                        }}
                        className="mt-1 inline-flex items-center px-3 py-1.5 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                      >
                        Dosyayı değiştir
                      </button>
                    </div>
                  ) : (
                    <div
                      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 hover:border-indigo-300 transition-colors duration-200"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex flex-col sm:flex-row items-center justify-center text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            <span>Dosya seçin</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.mp3,.mp4,.mov,.avi"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">veya sürükleyip bırakın</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, PDF, DOC, MP4, MP3 ve benzeri dosyalar
                          (maks. 50MB)
                        </p>

                        {/* ✅ Seçilen dosya adı (sürüklenmiş ya da seçilmiş) */}
                        {selectedFile && (
                          <p className="mt-2 text-sm text-green-600 font-medium">
                            Seçilen dosya: {selectedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Açıklama Alanı */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    İçerik Açıklaması
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    defaultValue={currentContent?.description || ""}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="İçerik hakkında kısa bir açıklama yazın..."
                  ></textarea>
                </div>

                {/* Etiketler */}
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Etiketler (virgülle ayırın)
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="tags"
                        id="tags"
                        defaultValue={currentContent?.tags?.join(", ") || ""}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="eğitim, müzik, matematik"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Aramada kolaylık sağlamak için etiketler ekleyin
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 1116 0A8 8 0 014 12z"
                      ></path>
                    </svg>
                    Yükleniyor...
                  </>
                ) : (
                  "Kaydet"
                )}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedFile(null); // seçilen dosyayı sıfırla
                }}
              >
                Kapat
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

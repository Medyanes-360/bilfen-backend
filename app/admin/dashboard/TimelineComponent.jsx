"use client";
// TimelineComponent.jsx - Tam responsive ve işlevsel zaman çizelgesi bileşeni
import React, { useState, useEffect } from "react";
import {
  Calendar,
  FileText,
  Gamepad2,
  Layers,
  MonitorPlay,
} from "lucide-react";
import { getAPI } from "@/services/fetchAPI";
import TimelineHeader from "./TimelineHeader";
import DateSelector from "./DateSelector";
import TimelineFooter from "./TimelineFooter";
import TimelineContent from "./TimelineContent";
import TimelineContentDetail from "./TimelineContentDetail";
import TimelineShowAddContent from "./TimelineShowAddContent";

const TimelineComponent = () => {
  // 11 günlük bir zaman aralığı oluştur (5 gün önce, bugün, 5 gün sonra)
  const createTimelineData = (centerDate) => {
    const result = [];
    const baseDate = new Date(centerDate);

    for (let i = -5; i <= 5; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);

      const dateString = date.toISOString().split("T")[0];

      result.push({
        date: dateString,
        isPast: date < new Date(), // karşılaştırmayı direkt tarih nesneleriyle yap
      });
    }
    return result;
  };

  const [contents, setContents] = useState([]);
  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data = await getAPI("/api/contents");
        if (data) {
          setContents(data);
        }
      } catch (error) {
        console.error("İçerikler yüklenirken hata oluştu:", error);
      }
    };
    fetchContents();
  }, []);

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );
  const [days, setDays] = useState(createTimelineData(today));
  const [dailyContent, setDailyContent] = useState([]);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Video",
    ageGroup: "4-5 yaş",
    branch: "Okul Öncesi",
    duration: "00:15:00",
    description: "",
  });

  const [previewUrl, setPreviewUrl] = useState("");

  // Responsive davranış için pencere genişliğini dinle
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log(contents, "contents");
  // Seçilen güne göre içerikleri yükle
  useEffect(() => {
    if (selectedDate) {
      const filtered = contents?.data?.filter((item) => {
        const studentDate = item.publishDateStudent;
        return studentDate && studentDate === selectedDate;
      });

      if (filtered?.length > 0) {
        setDailyContent(filtered);
      } else {
        setDailyContent(null); // içerik yok
      }
    } else {
      setDailyContent([]);
    }
  }, [selectedDate, contents]);

  // icerik izleme
  const viewContent = async (id) => {
    const content = contents.data?.find((item) => item.id === id);
    if (!content || !content.fileUrl) {
      console.error("Content or file URL not found for ID:", id);
      alert("İçerik veya dosya yolu bulunamadı.");
      return;
    }

    try {
      // Assuming the API endpoint correctly serves the file based on the URL parameter
      const response = await fetch(
        `/api/file/view?fileUrl=${encodeURIComponent(content.fileUrl)}`
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Dosya alınamadı veya JSON parse hatası" })); // Handle non-JSON errors
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const blob = await response.blob();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // Clean up previous URL if it exists
      }
      const fileURL = URL.createObjectURL(blob);
      setPreviewUrl(fileURL); // Show preview modal
    } catch (error) {
      console.error("Dosya görüntülenirken hata oluştu:", error);
      alert("Dosya görüntülenirken hata oluştu: " + error.message);
      setPreviewUrl(""); // Clear preview on error
    }
  };

  // Tarih formatı
  const formatDate = (dateString) => {
    if (!dateString) return { day: "", month: "", weekday: "", full: "" };

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("tr-TR", { month: "short" });
    const weekday = date.toLocaleString("tr-TR", { weekday: "short" });

    return {
      day,
      month,
      weekday,
      full: date.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };
  };

  // Gün seçimi
  const selectDay = (newDate) => {
    setSelectedDate(newDate);
    setDays(createTimelineData(newDate)); // yeni timeline'ı oluştur
  };

  // Gün stili
  const getDayStyle = (day) => {
    if (day.date === selectedDate) {
      return "date-selected bg-orange-500 text-white border-orange-500 shadow-lg";
    } else if (day.isPast) {
      return "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200";
    } else {
      return "bg-green-50 text-green-700 border-green-100 hover:bg-green-100";
    }
  };

  // İçerik türü ikonları
  const getContentTypeIcon = (type) => {
    const label = getContentTypeName(type);
    switch (label) {
      case "Video":
        return <MonitorPlay size={20} />;
      case "Döküman":
        return <FileText size={20} />;
      case "Oyun":
        return <Gamepad2 size={20} />;
      case "Etkileşimli":
      case "Etkileşimli İçerik":
        return <Layers size={20} />;
      // case 'Ses':
      //   return <Volume2 size={20} />;
      default:
        return <Calendar size={20} />;
    }
  };

  // İçerik türü sınıfları
  const getTypeClass = (type) => {
    const label = getContentTypeName(type); // "document" -> "Döküman"
    switch (label) {
      case "Video":
        return "bg-blue-100 text-blue-700";
      case "Döküman":
        return "bg-orange-100 text-orange-700";
      case "Oyun":
        return "bg-purple-100 text-purple-700";
      case "Etkileşimli":
      case "Etkileşimli İçerik": // opsiyonel olarak eklenebilir
        return "bg-green-100 text-green-700";
      case "Ses":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Yaş grubu renkleri
  const getAgeGroupColor = (ageGroup) => {
    switch (ageGroup) {
      case "3-4 yaş":
        return "bg-yellow-100 text-yellow-800";
      case "4-5 yaş":
        return "bg-blue-100 text-blue-800";
      case "5-6 yaş":
        return "bg-green-100 text-green-800";
      case "6-7 yaş":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [modalType, setModalType] = useState(null);
  const [currentContent, setCurrentContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filteredDailyContent =
    dailyContent?.filter((item) => item.isPublished && !item.isWeeklyContent) ||
    [];

  const contentTypes = [
    { id: "all", name: "Tümü" },
    { id: "video", name: "Video" },
    { id: "document", name: "Döküman" },
    { id: "interactive", name: "Etkileşimli" },
    { id: "game", name: "Oyun" },
    { id: "audio", name: "Ses" },
  ];

  const getContentTypeName = (typeId) => {
    const matched = contentTypes.find((t) => t.id === typeId);
    return matched ? matched.name : typeId;
  };
  const branchOptions = [
    { label: "Matematik", value: "MATEMATIK" },
    { label: "Türkçe", value: "TURKCE" },
    { label: "Fen Bilgisi", value: "FEN_BILGISI" },
    { label: "Sosyal Bilgiler", value: "SOSYAL_BILGILER" },
    { label: "İngilizce", value: "INGILIZCE" },
  ];

  const getBranchLabel = (value) => {
    const matched = branchOptions.find((b) => b.value === value);
    return matched ? matched.label : value;
  };

  // İçerik detaylarını görüntüleme
  const handleViewDetails = (content) => {
    setCurrentContent(content);
    setIsModalOpen(true);
    setModalType("details");
    // Gerçek uygulamada detay sayfasına yönlendirilecek
  };

  const handleDateInputChange = (newDateString) => {
    const newDate = new Date(newDateString);
    const formatted = newDate.toISOString().split("T")[0];
    setSelectedDate(formatted);
    setDays(createTimelineData(newDate));
  };

  // Önceki haftaya git
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7); // 7 gün geri al
    setSelectedDate(newDate.toISOString().split("T")[0]);
    setDays(createTimelineData(newDate));
  };

  // Sonraki haftaya git
  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7); // 7 gün ileri al
    setSelectedDate(newDate.toISOString().split("T")[0]);
    setDays(createTimelineData(newDate));
  };

  // Bugüne git
  const goToToday = () => {
    setSelectedDate(today.toISOString().split("T")[0]);
    setDays(createTimelineData(today));
  };

  // İçerik ekleme modalını aç
  const openAddContentModal = () => {
    setFormData({
      title: "",
      type: "Video",
      ageGroup: "4-5 yaş",
      branch: "Okul Öncesi",
      publishDate: selectedDate,
      duration: "00:15:00",
      description: "",
    });
    setShowAddContentModal(true);
  };

  // Form input değişimini takip et
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Form gönderimi
  const handleSubmit = (e) => {
    e.preventDefault();
    // Yeni içerik eklendiğini simüle et
    alert(`Yeni içerik eklendi: ${formData.title}`);

    // Günlük içeriklere yeni içeriği ekle
    const newContent = {
      ...formData,
      id: `new-${Date.now()}`, // Gerçek uygulamada arka uçtan gelecek
    };

    setDailyContent([...dailyContent, newContent]);
    setShowAddContentModal(false);
  };

  return (
    <div className="w-full bg-white shadow rounded-xl overflow-hidden">
      {/* Başlık ve Kontroller */}
      <TimelineHeader
        goToPreviousWeek={goToPreviousWeek}
        selectedDate={selectedDate}
        onDateChange={handleDateInputChange}
        goToNextWeek={goToNextWeek}
      />

      {/* Gün Seçici - Responsive Scroll */}
      <DateSelector
        days={days}
        selectedDate={selectedDate}
        selectDay={selectDay}
        formatDate={formatDate}
        getDayStyle={getDayStyle}
      />

      {/* İçerik Kartları - Responsive Grid */}
      <TimelineContent
        filteredDailyContent={filteredDailyContent}
        getTypeClass={getTypeClass}
        getContentTypeIcon={getContentTypeIcon}
        getContentTypeName={getContentTypeName}
        getAgeGroupColor={getAgeGroupColor}
        getBranchLabel={getBranchLabel}
        viewContent={viewContent}
        handleViewDetails={handleViewDetails}
        formatDate={formatDate}
        selectedDate={selectedDate}
      />

      {/* Alt Bilgi */}
      <TimelineFooter />

      {/* İçerik Ekleme Modalı */}
      {showAddContentModal && (
        <TimelineShowAddContent
          setShowAddContentModal={setShowAddContentModal}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      )}

      {isModalOpen && currentContent && (
        <TimelineContentDetail
          setIsModalOpen={setIsModalOpen}
          currentContent={currentContent}
          getContentTypeName={getContentTypeName}
          getBranchLabel={getBranchLabel}
        />
      )}

      {/* içeriği ön izleme */}
      {previewUrl && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-4xl bg-white p-4 shadow-lg rounded-lg z-50">
          <h3 className="text-xl font-semibold mb-2">Önizleme</h3>
          <iframe
            src={previewUrl}
            className="w-full h-96 border border-gray-300 rounded-lg"
          />
          <button
            onClick={() => setPreviewUrl("")}
            className="absolute top-2 right-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 cursor-pointer"
          >
            Kapat
          </button>
        </div>
      )}

      {/* Scrollbar Gizleme için CSS */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TimelineComponent;

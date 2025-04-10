'use client';

// TimelineComponent.jsx - Tam responsive ve işlevsel zaman çizelgesi bileşeni
import React, { useState, useEffect, useRef } from 'react';
import { timelineDays, dailyContents } from './mockData';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play,
  FileText,
  Gamepad2,
  Layers,
  Plus,
  Clock,
  BookOpen,
  Users,
  MonitorPlay,
  X,
  Volume2
} from 'lucide-react';
import { getAPI } from '@/services/fetchAPI';
const TimelineComponent = () => {
  // 11 günlük bir zaman aralığı oluştur (5 gün önce, bugün, 5 gün sonra)
  const createTimelineData = (centerDate) => {
    const result = [];
    const baseDate = new Date(centerDate);

    for (let i = -5; i <= 5; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);

      const dateString = date.toISOString().split('T')[0];

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
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const [days, setDays] = useState(createTimelineData(today));

  const [dailyContent, setDailyContent] = useState([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Video',
    ageGroup: '4-5 yaş',
    branch: 'Okul Öncesi',
    duration: '00:15:00',
    description: ''
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const scrollContainerRef = useRef(null);

  // Responsive davranış için pencere genişliğini dinle
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Seçilen güne göre içerikleri yükle
  useEffect(() => {
    if (selectedDate) {
      const filtered = contents.filter((item) => {
        const studentDate = item.publishDateStudent;
        const teacherDate = item.publishDateTeacher;
        return (
          (studentDate && studentDate === selectedDate) ||
          (teacherDate && teacherDate === selectedDate)
        );
      });

      if (filtered.length > 0) {
        setDailyContent(filtered);
      } else {
        setDailyContent(null); // içerik yok
      }
    } else {
      setDailyContent([]);
    }
  }, [selectedDate, contents]);

  // Seçili gün değiştiğinde scroll pozisyonunu ayarla
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const selectedElement = container.querySelector('.date-selected');

      if (selectedElement) {
        // Seçili elementi ortala
        const centerPosition = selectedElement.offsetLeft - (container.offsetWidth / 2) + (selectedElement.offsetWidth / 2);
        container.scrollTo({
          left: centerPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedDate]);
  // icerik izleme
  const viewContent = async (id) => {
    const content = contents.find((item) => item.id === id);
    if (!content) return;

    try {
      console.log("Dosya çağırılıyor:", content.fileUrl);

      const fileUrl = content.fileUrl;
      const response = await fetch(`/api/file/view?fileUrl=${encodeURIComponent(fileUrl)}`);

      console.log("API Yanıt:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Dosya alınamadı");
      }

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);

      console.log("Dosya Başarıyla Alındı:", fileURL);

      // State'e dosya URL'sini kaydet
      setPreviewUrl(fileURL);
    } catch (error) {
      console.error("Hata:", error);
      alert("Dosya görüntülenirken hata oluştu: " + error.message);
    }
  };
  // Tarih formatı
  const formatDate = (dateString) => {
    if (!dateString) return { day: '', month: '', weekday: '', full: '' };

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('tr-TR', { month: 'short' });
    const weekday = date.toLocaleString('tr-TR', { weekday: 'short' });

    return {
      day,
      month,
      weekday,
      full: date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
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
      return 'date-selected bg-orange-500 text-white border-orange-500 shadow-lg';
    } else if (day.isPast) {
      return 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200';
    } else {
      return 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100';
    }
  };

  // İçerik türü ikonları
  const getContentTypeIcon = (type) => {
    const label = getContentTypeName(type); 
  
    switch (label) {
      case 'Video':
        return <MonitorPlay size={20} />;
      case 'Döküman':
        return <FileText size={20} />;
      case 'Oyun':
        return <Gamepad2 size={20} />;
      case 'Etkileşimli':
      case 'Etkileşimli İçerik':
        return <Layers size={20} />;
      case 'Ses':
        return <Volume2 size={20} />;
      default:
        return <Calendar size={20} />;
    }
  };
  

  // İçerik türü sınıfları
  const getTypeClass = (type) => {
    const label = getContentTypeName(type); // "document" -> "Döküman"
  
    switch (label) {
      case 'Video':
        return 'bg-blue-100 text-blue-700';
      case 'Döküman':
        return 'bg-orange-100 text-orange-700';
      case 'Oyun':
        return 'bg-purple-100 text-purple-700';
      case 'Etkileşimli':
      case 'Etkileşimli İçerik': // opsiyonel olarak eklenebilir
        return 'bg-green-100 text-green-700';
      case 'Ses':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  

  // Yaş grubu renkleri
  const getAgeGroupColor = (ageGroup) => {
    switch (ageGroup) {
      case '3-4 yaş':
        return 'bg-yellow-100 text-yellow-800';
      case '4-5 yaş':
        return 'bg-blue-100 text-blue-800';
      case '5-6 yaş':
        return 'bg-green-100 text-green-800';
      case '6-7 yaş':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const [modalType, setModalType] = useState(null);


  const [currentContent, setCurrentContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filteredDailyContent = dailyContent?.filter(
    item => item.isPublished && !item.isWeeklyContent
  ) || [];
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
    setModalType('details');

    // Gerçek uygulamada detay sayfasına yönlendirilecek
  };

  // Önceki haftaya git
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7); // 7 gün geri al
    setSelectedDate(newDate.toISOString().split('T')[0]);
    setDays(createTimelineData(newDate));
  };

  // Sonraki haftaya git
  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7); // 7 gün ileri al
    setSelectedDate(newDate.toISOString().split('T')[0]);
    setDays(createTimelineData(newDate));
  };

  // Bugüne git
  const goToToday = () => {
    setSelectedDate(today.toISOString().split('T')[0]);
    setDays(createTimelineData(today));
  };

  // İçerik ekleme modalını aç
  const openAddContentModal = () => {
    setFormData({
      title: '',
      type: 'Video',
      ageGroup: '4-5 yaş',
      branch: 'Okul Öncesi',
      publishDate: selectedDate,
      duration: '00:15:00',
      description: ''
    });
    setShowAddContentModal(true);
  };

  // Form input değişimini takip et
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
      id: `new-${Date.now()}` // Gerçek uygulamada arka uçtan gelecek
    };

    setDailyContent([...dailyContent, newContent]);
    setShowAddContentModal(false);
  };

  

  return (
    <div className="w-full bg-white shadow rounded-xl overflow-hidden">
      {/* Başlık ve Kontroller */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Zaman Çizelgesi</h2>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={goToPreviousWeek}
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <div className="relative items-center">

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                const formatted = newDate.toISOString().split("T")[0];

                setSelectedDate(formatted);
                setDays(createTimelineData(newDate));
              }}
              className="pl-3 pr-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-orange-500 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            />
          </div>




          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={goToNextWeek}
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Gün Seçici - Responsive Scroll */}
      <div className="relative w-full bg-gray-50 border-b border-gray-200">
        {/* Sol-Sağ Scroll Gradyanları */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex px-2 py-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="flex mx-auto space-x-2 md:space-x-3">
            {days.map((day) => {
              const date = formatDate(day.date);
              return (
                <div
                  key={day.date}
                  onClick={() => selectDay(day.date)}
                  className={`flex-shrink-0 rounded-lg border w-16 sm:w-20 md:w-24 py-2 px-1 flex flex-col items-center cursor-pointer snap-center ${getDayStyle(day)
                    } ${day.date === selectedDate ? 'ring-2 ring-offset-2 ring-orange-300 date-selected' : ''}
`} // <-- BURAYA 'date-selected' classı
                >

                  <div className="text-xs font-medium uppercase">{date.weekday}</div>
                  <div className="my-1 text-xl sm:text-2xl font-bold">{date.day}</div>
                  <div className="text-xs">{date.month}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Günün İçerikleri Başlık */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
            <Calendar size={18} className="mr-2 text-orange-500" />
            {formatDate(selectedDate).full}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Planlanmış İçerikler
          </p>
        </div>
        {/* <button
          onClick={openAddContentModal}
          className="mt-3 sm:mt-0 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
        >
          <Plus size={16} className="mr-2" />
          İçerik Ekle
        </button> */}
      </div>

      {/* İçerik Kartları - Responsive Grid */}
      <div className="p-4 md:p-6">


        {filteredDailyContent.length > 0

          ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDailyContent.map((content, index) => (
                <div
                  key={content.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* İçerik Başlığı */}
                  <div className={`${getTypeClass(content.type)} px-4 py-3 flex items-center justify-between`}>
  <div className="flex items-center">
    {getContentTypeIcon(content.type)}
    <span className="ml-2 font-semibold">{getContentTypeName(content.type)}</span>
  </div>
</div>


                  {/* İçerik Bilgileri */}
                  <div className="p-4">
                    <h4 className="text-base font-semibold text-gray-900 mb-2">{content.title}</h4>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getAgeGroupColor(content.ageGroup)}`}>
                        <Users size={12} className="mr-1" />
                        {content.ageGroup}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                        <BookOpen size={12} className="mr-1" />
                        {getBranchLabel(content.branch)}
                      </span>
                    </div>
                  </div>

                  {/* Butonlar */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                    <button
                      onClick={() => viewContent(content.id)}
                      className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      <Play size={14} className="mr-1" />
                     Görüntüle
                    </button>
                    <button
                      onClick={() => handleViewDetails(content)}
                      className="inline-flex items-center text-xs font-medium text-gray-600 hover:text-gray-800"
                    >
                      <FileText size={14} className="mr-1" />
                      Detaylar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full py-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">İçerik Bulunamadı</h3>
              <p className="text-sm text-gray-500 max-w-md mb-4">
                Bu tarihe ait planlanmış içerik bulunmamaktadır.
              </p>
              {/* <button
              onClick={openAddContentModal}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
            >
              <Plus size={16} className="mr-2" />
              İçerik Planla
            </button> */}
            </div>
          )}
      </div>

      {/* Alt Bilgi */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50 text-xs md:text-sm">
        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-1.5"></div>
            <span className="text-gray-600">Bugün</span>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-200 mr-1.5"></div>
            <span className="text-gray-600">Geçmiş</span>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-100 mr-1.5"></div>
            <span className="text-gray-600">Gelecek</span>
          </div>
        </div>

        {/* <button className="text-orange-500 hover:text-orange-700 font-medium flex items-center transition-colors duration-200">
          Tüm içerik planını gör
          <ChevronRight size={16} className="ml-1" />
        </button> */}
      </div>

      {/* İçerik Ekleme Modalı */}
      {showAddContentModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-transparent backdrop-blur-sm"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Yeni İçerik Ekle
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {/* İçerik Başlığı */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        İçerik Başlığı
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    {/* İçerik Türü */}
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        İçerik Türü
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="Video">Video</option>
                        <option value="Doküman">Doküman</option>
                        <option value="Oyun">Oyun</option>
                        <option value="Etkileşimli İçerik">Etkileşimli İçerik</option>
                      </select>
                    </div>

                    {/* Kategori */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Kategori
                      </label>
                      <input
                        type="text"
                        name="category"
                        id="category"
                        value={formData.category || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    {/* Branş */}
                    <div>
                      <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                        Branş
                      </label>
                      <select
                        id="branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="Okul Öncesi">Okul Öncesi</option>
                        <option value="İngilizce">İngilizce</option>
                        <option value="Müzik">Müzik</option>
                        <option value="Görsel Sanatlar">Görsel Sanatlar</option>
                        <option value="Drama">Drama</option>
                        <option value="Beden Eğitimi">Beden Eğitimi</option>
                      </select>
                    </div>

                    {/* Yaş Grubu */}
                    <div>
                      <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700">
                        Yaş Grubu
                      </label>
                      <select
                        id="ageGroup"
                        name="ageGroup"
                        value={formData.ageGroup}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="3-4 yaş">3-4 yaş</option>
                        <option value="4-5 yaş">4-5 yaş</option>
                        <option value="5-6 yaş">5-6 yaş</option>
                      </select>
                    </div>

                    {/* İki Kolonlu Alan: Yayın Tarihleri */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Öğrenci Yayın Tarihi */}
                      <div>
                        <label htmlFor="studentPublishDate" className="block text-sm font-medium text-gray-700">
                          Öğrenci Yayın Tarihi
                        </label>
                        <input
                          type="date"
                          name="studentPublishDate"
                          id="studentPublishDate"
                          value={formData.studentPublishDate || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      {/* Öğretmen Yayın Tarihi */}
                      <div>
                        <label htmlFor="teacherPublishDate" className="block text-sm font-medium text-gray-700">
                          Öğretmen Yayın Tarihi
                        </label>
                        <input
                          type="date"
                          name="teacherPublishDate"
                          id="teacherPublishDate"
                          value={formData.teacherPublishDate || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Ek Materyal Seçeneği */}
                    <div className="mt-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="isWeeklyContent"
                          id="isWeeklyContent"
                          checked={formData.isWeeklyContent || false}
                          onChange={(e) => {
                            handleInputChange({
                              target: {
                                name: 'isWeeklyContent',
                                value: e.target.checked
                              }
                            });
                            const dateContainer = document.getElementById('weeklyContentDateContainer');
                            if (dateContainer) {
                              dateContainer.classList.toggle('hidden', !e.target.checked);
                            }
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Ek Materyal</span>
                      </label>
                    </div>

                    {/* Ek Materyal Tarih Aralığı */}
                    <div id="weeklyContentDateContainer" className={formData.isWeeklyContent ? '' : 'hidden'}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="weeklyContentStartDate" className="block text-sm font-medium text-gray-700">
                            Başlangıç Tarihi
                          </label>
                          <input
                            type="date"
                            name="weeklyContentStartDate"
                            id="weeklyContentStartDate"
                            value={formData.weeklyContentStartDate || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="weeklyContentEndDate" className="block text-sm font-medium text-gray-700">
                            Bitiş Tarihi
                          </label>
                          <input
                            type="date"
                            name="weeklyContentEndDate"
                            id="weeklyContentEndDate"
                            value={formData.weeklyContentEndDate || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Açıklama */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Açıklama
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="İçerik hakkında kısa bir açıklama yazın..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    İçerik Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddContentModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && currentContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4">
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl h-[60vh] overflow-y-auto p-6 sm:p-8">
            {/* X Butonu */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 transition"
            >
              <X size={24} />
            </button>

            {/* Başlık */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">{currentContent.title}</h2>
            <div className="w-16 h-1 bg-orange-400 mx-auto rounded-full mb-6" />
            <div className="divide-y divide-gray-200 space-y-4 text-sm sm:text-base text-gray-800 leading-relaxed">
              {/* İçerik Bilgileri */}
              {[
                ['Tür', getContentTypeName(currentContent.type)],
                ['Yaş Grubu', currentContent.ageGroup],
                ['Branş', getBranchLabel(currentContent.branch)],
                ['Açıklama', currentContent.description || 'Açıklama bulunmuyor.'],
              ].map(([label, value], i) => (
                <div key={i} className="pt-4 first:pt-0 flex items-start">
                  <span className="w-32 font-semibold text-gray-900 shrink-0">{label}:</span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}

            </div>
          </div>
        </div>
      )}

      {/* içeriği ön izleme */}

      {previewUrl && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-4xl bg-white p-4 shadow-lg rounded-lg z-50">
          <h3 className="text-xl font-semibold mb-2">Önizleme</h3>
          <iframe src={previewUrl} className="w-full h-96 border border-gray-300 rounded-lg" />
          <button
            onClick={() => setPreviewUrl("")}
            className="absolute top-2 right-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600">
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
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
  X
} from 'lucide-react';

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
      // Eğer seçilen gün için içerik varsa getir, yoksa örnek veri oluştur
      if (dailyContents[selectedDate]) {
        setDailyContent(dailyContents[selectedDate]);
      } else {
        // Örnek içerikler (mock veri)
        setDailyContent([
          {
            id: `auto-${selectedDate}-1`,
            title: "Gün İçi Aktivite",
            type: "Video",
            ageGroup: "4-5 yaş",
            branch: "Okul Öncesi",
            duration: "00:15:00"
          },
          {
            id: `auto-${selectedDate}-2`,
            title: "Dil Gelişimi",
            type: "Etkileşimli İçerik",
            ageGroup: "5-6 yaş",
            branch: "İngilizce",
            duration: "00:20:00"
          }
        ]);
      }
    } else {
      setDailyContent([]);
    }
  }, [selectedDate]);

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
    switch (type) {
      case 'Video':
        return <MonitorPlay size={20} />;
      case 'Doküman':
        return <FileText size={20} />;
      case 'Oyun':
        return <Gamepad2 size={20} />;
      case 'Etkileşimli İçerik':
        return <Layers size={20} />;
      default:
        return <Calendar size={20} />;
    }
  };

  // İçerik türü sınıfları
  const getTypeClass = (type) => {
    switch (type) {
      case 'Video':
        return 'bg-blue-100 text-blue-700';
      case 'Doküman':
        return 'bg-orange-100 text-orange-700';
      case 'Oyun':
        return 'bg-purple-100 text-purple-700';
      case 'Etkileşimli İçerik':
        return 'bg-green-100 text-green-700';
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // İçerik izleme
  const handleWatchContent = (content) => {
    alert(`"${content.title}" içeriği izleniyor...`);
    // Gerçek uygulamada video oynatıcı açılacak
  };

  // İçerik detaylarını görüntüleme
  const handleViewDetails = (content) => {
    alert(`"${content.title}" içeriğinin detayları görüntüleniyor...`);
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
          <button
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            onClick={goToToday}
          >
            <Calendar size={16} className="mr-2 text-orange-500" />
            Bugün
          </button>
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
        {dailyContent && dailyContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyContent.map((content, index) => (
              <div
                key={content.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* İçerik Başlığı */}
                <div className={`${getTypeClass(content.type)} px-4 py-3 flex items-center justify-between`}>
                  <div className="flex items-center">
                    {getContentTypeIcon(content.type)}
                    <span className="ml-2 font-semibold">{content.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span className="text-xs font-medium">{content.duration}</span>
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
                      {content.branch}
                    </span>
                  </div>
                </div>

                {/* Butonlar */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => handleWatchContent(content)}
                    className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    <Play size={14} className="mr-1" />
                    İzle
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
              Bu tarihe ait planlanmış içerik bulunmamaktadır. Yeni içerik eklemek için aşağıdaki butona tıklayabilirsiniz.
            </p>
            <button
              onClick={openAddContentModal}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
            >
              <Plus size={16} className="mr-2" />
              İçerik Planla
            </button>
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
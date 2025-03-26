// components/ContentManagement.jsx

// 1. İmport İfadeleri
// - React hooks ve diğer gerekli kütüphaneler
// - Lucide icon bileşenleri

// 2. ContentManagement Komponenti
// - Örnek veriler ve sabit değerler

// 3. State Tanımlamaları
// - İçerik listesi, filtreleme, sayfalama, modal durumu vb.

// 4. Yardımcı Fonksiyonlar 
// - İçerik ikonu belirleme
// - Durum rengi belirleme
// - Dosya işlemleri
// - Filtreleme ve sıralama fonksiyonları

// 5. Form İşleme Fonksiyonları
// - Ekleme/güncelleme form submit
// - İçerik silme
// - İçerik görüntüleme

// 6. Sayfalama Hesaplamaları

// 7. useEffect Hooks
// - Filtreleme ve içerik yönetimi

// 8. Ana JSX Yapısı
// 8.1. Ana Konteyner
// 8.2. Başlık ve İçerik Türü Seçimleri
// 8.3. Arama ve Filtre Alanı
// 8.4. İçerik Tablosu
// 8.5. Sayfalama
// 8.6. İçerik Ekleme/Düzenleme Modal

"use client"

// components/ContentManagement.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronRight,
  ChevronLeft,
  Music,
  Video,
  FileText,
  Book,
  Image,
  Download,
  Upload,
  AlertCircle,
  Calendar,
  Clock,
  Tag,
  Users,
  RefreshCw,
  FilterX,
  X,
  List,
  CheckSquare
} from 'lucide-react';

import ConfirmModal from '@/components/ConfirmModal';
import { getAPI, deleteAPI, postAPI } from '@/services/fetchAPI';


// İçerik türleri
const contentTypes = [
  { id: 'all', name: 'Tümü' },
  { id: 'video', name: 'Video' },
  { id: 'document', name: 'Döküman' },
  { id: 'interactive', name: 'Etkileşimli' },
  { id: 'game', name: 'Oyun' },
  { id: 'audio', name: 'Ses' },
];

// Örnek içerik verileri
// Örnek içerik verileri - komponent dışında tanımlayın


const ContentManagement = () => {

  // State tanımlamaları
  const [previewUrl, setPreviewUrl] = useState("");
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [activeType, setActiveType] = useState('all');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formType, setFormType] = useState('');
  const [advancedFilterOptions, setAdvancedFilterOptions] = useState({
    ageGroup: '',
    category: '',
    status: '',
    publishDateStudent: '',
    publishDateTeacher: ''
  });
  const [sortOption, setSortOption] = useState('newest');
  const [bulkMode, setBulkMode] = useState(false); // Toplu mod aktif mi?
  const [selectedItems, setSelectedItems] = useState([]); // Seçili öğe ID'leri
  const [bulkActionModalOpen, setBulkActionModalOpen] = useState(false); // Toplu işlem modalı açık mı?
  const [bulkAction, setBulkAction] = useState(''); // Hangi toplu işlem yapılacak: 'update' veya 'delete'
  const [isBulkUpdating, setIsBulkUpdating] = useState(false); // Toplu güncelleme işlemi devam ediyor mu?

  const filterMenuRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAPI("/api/contents"); // endpoint'i güncelle
      if (data) {
        setContents(data);
        setFilteredContents(data)
      }
    };

    fetchData();
  }, []);

  const handleTypeChange = (e) => {
    setFormType(e.target.value);
  };


  // Toplu işlem yapma
  const handleBulkAction = (e) => {
    e.preventDefault();

    if (bulkAction === 'delete') {
      // Toplu silme işlemi

      const updatedContents = contents.filter(item => !selectedItems.includes(item.id));
      setContents(updatedContents);
      setSelectedItems([]);
      setBulkActionModalOpen(false);
      setBulkMode(false);

    } else if (bulkAction === 'update') {
      // Toplu güncelleme işlemi
      setIsBulkUpdating(true);

      const bulkCategory = document.getElementById('bulkCategory')?.value;
      const bulkBranch = document.getElementById('bulkBranch')?.value;
      const bulkType = document.getElementById('bulkType')?.value;
      const bulkAgeGroup = document.getElementById('bulkAgeGroup')?.value;
      const bulkDescription = document.getElementById('bulkDescription')?.value;
      const bulkStudentPublishDate = document.getElementById('bulkStudentPublishDate')?.value;
      const bulkTeacherPublishDate = document.getElementById('bulkTeacherPublishDate')?.value;
      const bulkIsWeeklyContent = document.getElementById('bulkIsWeeklyContent')?.checked;
      const bulkWeeklyContentStartDate = document.getElementById('bulkWeeklyContentStartDate')?.value;
      const bulkWeeklyContentEndDate = document.getElementById('bulkWeeklyContentEndDate')?.value;
      // Toplu güncelleme simülasyonu
      setTimeout(() => {
        const updatedContents = contents.map(item => {
          if (selectedItems.includes(item.id)) {
            return {
              ...item,
              category: bulkCategory || item.category,
              branch: bulkBranch || item.branch,
              type: bulkType || item.type,
              ageGroup: bulkAgeGroup || item.ageGroup,
              description: bulkDescription || item.description,
              publishDateStudent: bulkStudentPublishDate || item.publishDateStudent,
              publishDateTeacher: bulkTeacherPublishDate || item.publishDateTeacher,
              isWeeklyContent: bulkIsWeeklyContent !== undefined ? bulkIsWeeklyContent : item.isWeeklyContent,
              weeklyContentStartDate: bulkIsWeeklyContent ? (bulkWeeklyContentStartDate || item.weeklyContentStartDate) : null,
              weeklyContentEndDate: bulkIsWeeklyContent ? (bulkWeeklyContentEndDate || item.weeklyContentEndDate) : null
            };
          }
          return item;
        });

        setContents(updatedContents);
        setIsBulkUpdating(false);
        setSelectedItems([]);
        setBulkActionModalOpen(false);
        setBulkMode(false);
      }, 1500);
    }
  };

  // Toplu seçimi temizleme
  const clearBulkSelection = () => {
    setSelectedItems([]);
  };

  const hasActiveFilters = () => {
    return advancedFilterOptions.ageGroup !== '' ||
      advancedFilterOptions.category !== '' ||
      advancedFilterOptions.status !== '' ||
      advancedFilterOptions.publishDateStudent !== '' ||
      advancedFilterOptions.publishDateTeacher !== '' ||
      activeType !== 'all' ||
      searchTerm !== '';
  };

  // İçerik filtreleme
  useEffect(() => {
    const filteredContents = contents.filter((content) => {
      const title = content.title || ''; // Ensure title is a string
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = activeType === 'all' || content.type === activeType;
      const matchesStatus = advancedFilterOptions.status === '' || content.status === advancedFilterOptions.status;
      const matchesAgeGroup = advancedFilterOptions.ageGroup === '' || content.ageGroup === advancedFilterOptions.ageGroup;

      // Öğrenci yayın tarihi kontrolü
      const studentDate = advancedFilterOptions.publishDateStudent ? new Date(advancedFilterOptions.publishDateStudent) : null;
      const contentStudentDate = content.publishDateStudent ? new Date(content.publishDateStudent) : null;
      const matchesStudentDate = !studentDate || !contentStudentDate ||
        contentStudentDate.toDateString() === studentDate.toDateString();

      // Öğretmen yayın tarihi kontrolü
      const teacherDate = advancedFilterOptions.publishDateStudent ? new Date(advancedFilterOptions.publishDateTeacher) : null;
      const contentTeacherDate = content.publishDateTeacher ? new Date(content.publishDateTeacher) : null;
      const matchesTeacherDate = !teacherDate || !contentTeacherDate ||
        contentTeacherDate.toDateString() === teacherDate.toDateString();

      return matchesSearch && matchesType && matchesStatus && matchesAgeGroup && matchesStudentDate && matchesTeacherDate;
    });

    setFilteredContents(filteredContents);
    setCurrentPage(1); // Reset to the first page when filtering
  }, [activeType, searchTerm, advancedFilterOptions, contents]);

  // Filtreleme menüsü dışına tıklandığında kapatma
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setFilterMenuOpen(false);
      }
    }

    // Olay dinleyicisini ekle
    document.addEventListener("mousedown", handleClickOutside);

    // Temizleme işlevi
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterMenuRef]);


  // İçerik ikonlarını belirleme
  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-green-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-amber-500" />;
      case 'interactive':
        return <Book className="w-5 h-5 text-purple-500" />;
      case 'game':
        return <Image className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  // Status renklerini belirleme
  const getStatusColor = (status) => {
    switch (status) {
      case 'Yüksek Katılım':
        return 'bg-green-100 text-green-800';
      case 'Orta Katılım':
        return 'bg-yellow-100 text-yellow-800';
      case 'Düşük Katılım':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Dosya yükleme işlemi
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Dosya bilgisi gösterimi
      const fileInfoElement = document.getElementById('selected-file-info');
      if (fileInfoElement) {
        fileInfoElement.classList.remove('hidden');
        const fileNameSpan = fileInfoElement.querySelector('span');
        if (fileNameSpan) {
          const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
          fileNameSpan.textContent = `${file.name} (${fileSizeMB} MB)`;
        }
      }
    }
  }, []);

  // Dosya sürükle-bırak işlemi
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-50');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
  }, []);


  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);

      // Dosya input değerini güncelleme (manuel olarak)
      const fileInput = document.getElementById('file-upload');
      if (fileInput) {
        // Dosya bilgisi gösterimi
        const fileInfoElement = document.getElementById('selected-file-info');
        if (fileInfoElement) {
          fileInfoElement.classList.remove('hidden');
          const fileNameSpan = fileInfoElement.querySelector('span');
          if (fileNameSpan) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            fileNameSpan.textContent = `${file.name} (${fileSizeMB} MB)`;
          }
        }
      }
    }
  }, []);

  // Gelişmiş filtreleme
  const applyAdvancedFilters = useCallback(() => {
    // Filtre menüsünü kapat
    setFilterMenuOpen(false);
    setCurrentPage(1); // İlk sayfaya dön
  }, [advancedFilterOptions]);

  // Sıralama işlemi
  const handleSort = useCallback((option) => {
    setSortOption(option);
    let sortedContents = [...filteredContents];

    switch (option) {
      case 'newest':
        sortedContents.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        break;
      case 'oldest':
        sortedContents.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
        break;
      case 'title-asc':
        sortedContents.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sortedContents.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredContents(sortedContents);
  }, [filteredContents]);

  // İçerik ekleme/güncelleme modalını açma
  const openModal = (content = null) => {
    setCurrentContent(content);
    setIsModalOpen(true);
  };


  // İçerik silme
  const handleDeleteContent = (id) => {
    setSelectedId(id);         // sadece id saklanıyor
    setConfirmOpen(true);      // modal açılıyor
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      // API'den veriyi sil
      await deleteAPI(`/api/contents/${selectedId}`);

      // Başarıyla silindiyse state'ten de kaldır
      setContents(prevContents => prevContents.filter(item => item.id !== selectedId));

      // Modal'ı kapat ve seçili ID'yi temizle
      setConfirmOpen(false);
      setSelectedId(null);
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedId(null);
  };

  // Form gönderildiğinde
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData(e.target);
    const contentType = formData.get("type");

    // Etiketleri düzenle
    const tagsString = formData.get("tags") || "";
    const tagsArray = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    //  Dosya yükleme
    let fileUrl = null;

    if (selectedFile) {
      try {
        const uploadForm = new FormData();
        uploadForm.append("file", selectedFile);

        const uploadRes = await fetch("/api/file/upload", {
          method: "POST",
          body: uploadForm,
        });

        const uploadJson = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error("Dosya yüklenemedi: " + uploadJson?.detail);
        }

        // 🎯 fileUrl artık sadece dosya key'i (örnek: uploads/abc-uuid.docx)
        fileUrl = uploadJson.url || uploadJson.key;
      } catch (uploadErr) {
        console.error("Dosya yükleme hatası:", uploadErr);
        alert("Dosya yüklenemedi. Lütfen tekrar deneyin.");
        setIsUploading(false);
        return;
      }
    }

    // İçerik verisi
    const contentData = {
      title: formData.get("title"),
      type: contentType,
      category: formData.get("category"),
      branch: formData.get("branch"),
      ageGroup: formData.get("ageGroup"),
      publishDateStudent: formData.get("publishDateStudent") ? new Date(formData.get("publishDateStudent")).toISOString() : null,
      publishDateTeacher: formData.get("publishDateTeacher") ? new Date(formData.get("publishDateTeacher")).toISOString() : null,
      endDateStudent: formData.get("weeklyContentEndDate") ? new Date(formData.get("weeklyContentEndDate")).toISOString() : null,
      endDateTeacher: formData.get("weeklyContentEndDate") ? new Date(formData.get("weeklyContentEndDate")).toISOString() : null,
      isActive: formData.get("status") === "active",
      fileUrl: fileUrl,
      description: formData.get("description") || null,
      tags: tagsArray,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      Feedback: []
    };

    try {
      let response;
      if (currentContent) {
        // Mevcut içeriği güncelle
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contents/${currentContent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contentData),
        });

        if (!response.ok) {
          throw new Error('İçerik güncellenemedi');
        }

        setContents(contents.map(content =>
          content.id === currentContent.id ? { ...content, ...contentData } : content
        ));
        console.log("İçerik güncellendi:", contentData);
      } else {
        // Yeni içerik oluştur
        response = await postAPI("/api/contents", contentData);
        if (response) {
          setContents([...contents, response]);
          console.log("Yeni içerik eklendi:", response);
        }
      }
    } catch (error) {
      console.error("İçerik işlemi sırasında hata oluştu:", error);
      alert("İçerik kaydedilirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setIsModalOpen(false);
      setCurrentContent(null);
    }
  };



  // İçeriği görüntüleme
  const viewContent = async (id) => {
    const content = contents.find(item => item.id === id);
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

  }
  // Sayfalama hesaplamaları
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);

  // Sayfa değiştirme
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg shadow">
        {/* Başlık ve Ana İşlemler */}
        <div className="border-b border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Son Eklenen İçerikler</h1>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            {/* İçerik türleri */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {contentTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setActiveType(type.id)}
                  className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap ${activeType === type.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {type.name}
                </button>
              ))}
            </div>

            <div className="ml-auto sm:ml-0 flex items-center gap-2">
              {/* Yeni içerik ekleme butonu */}
              <button
                onClick={() => openModal()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="w-5 h-5 mr-1" />
                Yeni İçerik
              </button>

              {/* Toplu İşlemler Butonu */}
              <button
                onClick={() => {
                  setBulkMode(!bulkMode);
                  setSelectedItems([]);
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {bulkMode ? (
                  <>
                    <X className="w-5 h-5 mr-1" />
                    İptal
                  </>
                ) : (
                  <>
                    <List className="w-5 h-5 mr-1" />
                    Toplu İşlemler
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Arama ve Filtreler */}
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center border-b border-gray-200">
          {/* Arama */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
              placeholder="İçerik ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sıralama ve Filtreler Butonları */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Sıralama Butonu */}
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={sortOption}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="title-asc">Başlık (A-Z)</option>
                <option value="title-desc">Başlık (Z-A)</option>
              </select>
            </div>

            {/* Filtreleme Butonu ve Popup Menüsü */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    console.log('Filtre butonuna tıklandı, mevcut durum:', filterMenuOpen);
                    setFilterMenuOpen(!filterMenuOpen);
                  }}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {hasActiveFilters() ? (
                    <FilterX className="w-5 h-5 mr-2 text-indigo-600" />
                  ) : (
                    <Filter className="w-5 h-5 mr-2 text-gray-400" />
                  )}
                  Filtreler
                </button>

                {hasActiveFilters() && (
                  <button
                    onClick={() => {
                      setAdvancedFilterOptions({
                        ageGroup: '',
                        category: '',
                        status: '',
                        publishDateStudent: '',
                        publishDateTeacher: ''
                      });
                      setActiveType('all');
                      setSearchTerm('');
                    }}
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FilterX className="w-5 h-5 mr-2 text-gray-400" />
                    Temizle
                  </button>
                )}
              </div>

              {filterMenuOpen && (
                <div
                  ref={filterMenuRef}
                  className="absolute right-0 top-12 mt-1 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                >
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Filtreleme Seçenekleri</h3>

                    <div className="space-y-4">
                      {/* Yaş Grubu Filtresi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yaş Grubu</label>
                        <select
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          value={advancedFilterOptions.ageGroup}
                          onChange={(e) => setAdvancedFilterOptions({ ...advancedFilterOptions, ageGroup: e.target.value })}
                        >
                          <option value="">Tümü</option>
                          <option value="3-4 yaş">3-4 yaş</option>
                          <option value="4-5 yaş">4-5 yaş</option>
                          <option value="5-6 yaş">5-6 yaş</option>
                          <option value="6-7 yaş">6-7 yaş</option>
                        </select>
                      </div>

                      {/* Kategori Filtresi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        <select
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          value={advancedFilterOptions.category}
                          onChange={(e) => setAdvancedFilterOptions({ ...advancedFilterOptions, category: e.target.value })}
                        >
                          <option value="">Tümü</option>
                          <option value="Okul Öncesi">Okul Öncesi</option>
                          <option value="Müzik">Müzik</option>
                          <option value="İngilizce">İngilizce</option>
                          <option value="Görsel Sanatlar">Görsel Sanatlar</option>
                          <option value="Bilim">Bilim</option>
                          <option value="Matematik">Matematik</option>
                          <option value="Dil Gelişimi">Dil Gelişimi</option>
                          <option value="Sosyal Gelişim">Sosyal Gelişim</option>
                          <option value="Sağlık">Sağlık</option>
                        </select>
                      </div>

                      {/* Öğrenci Yayın Tarihi Filtresi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Öğrenci Yayın Tarihi</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={advancedFilterOptions.publishDateStudent}
                            onChange={(e) => setAdvancedFilterOptions({ ...advancedFilterOptions, publishDateStudent: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Öğretmen Yayın Tarihi Filtresi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Öğretmen Yayın Tarihi</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={advancedFilterOptions.publishDateTeacher}
                            onChange={(e) => setAdvancedFilterOptions({ ...advancedFilterOptions, publishDateTeacher: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => {
                            setAdvancedFilterOptions({
                              ageGroup: '',
                              category: '',
                              status: '',
                              publishDateStudent: '',
                              publishDateTeacher: ''
                            });
                          }}
                        >
                          Temizle
                        </button>
                        <button
                          className="px-3 py-2 text-indigo-600 hover:bg-indigo-100 rounded"
                          onClick={applyAdvancedFilters}
                        >
                          Uygula
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* İçerik Tablosu */}
        <div className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {bulkMode && (
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 rounded border-gray-300 cursor-pointer focus:ring-indigo-500"
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newSelections = [
                                ...new Set([...selectedItems, ...currentItems.map(item => item.id)])
                              ];

                              if (newSelections.length > 10) {
                                setShowLimitModal(true); // modal aç
                                return;
                              }

                              setSelectedItems(newSelections);
                            } else {
                              // Seçim kaldırılıyorsa sadece currentItems'ları çıkar
                              setSelectedItems(selectedItems.filter(id => !currentItems.map(item => item.id).includes(id)));
                            }
                          }}
                          checked={currentItems.every(item => selectedItems.includes(item.id)) && currentItems.length > 0}
                        />

                      </div>
                    </th>
                  )}
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İçerik
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branş
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yaş
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öğrenci Yayın Tarihi
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öğretmen Yayın Tarihi
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ek Materyal
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yayın Kriterleri
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((content) => (
                  <tr key={content.id}>
                    {bulkMode && (
                      <td className="px-3 py-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className={`h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 ${selectedItems.length >= 10 && !selectedItems.includes(content.id) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            checked={selectedItems.includes(content.id)}
                            disabled={selectedItems.length >= 10 && !selectedItems.includes(content.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (selectedItems.length >= 10) {
                                  setShowLimitModal(true);
                                  return;
                                }
                                setSelectedItems([...selectedItems, content.id]);
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== content.id));
                              }
                            }}
                          />
                        </div>
                      </td>
                    )}
                    <td className="px-3 py-2">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          {getContentIcon(content.type)}
                        </div>
                        <div className="ml-2">
                          <div className="text-xs font-medium text-gray-900 truncate max-w-[200px]">
                            {content.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-xs text-gray-900">{content.category || '-'}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-xs text-gray-900">{content.branch || '-'}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-xs text-gray-900">{content.ageGroup || '-'}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-xs text-gray-900">
                        {content.publishDateStudent ? new Date(content.publishDateStudent).toLocaleDateString('tr-TR') : '-'}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-xs text-gray-900">
                        {content.publishDateTeacher ? new Date(content.publishDateTeacher).toLocaleDateString('tr-TR') : '-'}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-xs text-gray-900">
                        {content.isWeeklyContent ? (
                          <CheckSquare className="w-4 h-4 text-green-500" />
                        ) : (
                          '-'
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-xs text-gray-900">
                        {(() => {
                          const missingFields = [];
                          if (!content.ageGroup) missingFields.push('Yaş Grubu');
                          if (!content.publishDateStudent) missingFields.push('Öğrenci Yayın Tarihi');
                          if (!content.publishDateTeacher) missingFields.push('Öğretmen Yayın Tarihi');
                          if (!content.branch) missingFields.push('Branş');
                          return missingFields.length > 0 ? (
                            <span className="text-red-600">{missingFields.join(', ')}</span>
                          ) : '-';
                        })()}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => viewContent(content.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal(content)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                          title="Sil"
                          onClick={() => handleDeleteContent(content.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Toplu İşlem Butonları */}
        {bulkMode && selectedItems.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {selectedItems.length} içerik seçildi
              </span>
              <button
                onClick={clearBulkSelection}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Seçimi Temizle
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setBulkAction('update');
                  setBulkActionModalOpen(true);
                }}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Edit className="w-4 h-4 mr-1" />
                Güncelle
              </button>
              <button
                onClick={() => {
                  setBulkAction('delete');
                  setBulkActionModalOpen(true);
                }}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Sil
              </button>
            </div>
          </div>
        )}

        {/* Sayfalama */}
        <div className="p-4 sm:p-6">
          <nav className="flex justify-end">
            <div className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10"
              >
                <span className="sr-only">Önceki</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* Sayfa Numaraları */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === currentPage;
                const isNearCurrentPage = Math.abs(pageNumber - currentPage) <= 1;
                const isFirstPage = pageNumber === 1;
                const isLastPage = pageNumber === totalPages;

                if (isFirstPage || isLastPage || isNearCurrentPage) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:z-10 ${isCurrentPage
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }

                if (pageNumber === 2 && currentPage > 3) {
                  return (
                    <span
                      key={`ellipsis-${pageNumber}`}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  );
                }

                if (pageNumber === totalPages - 1 && currentPage < totalPages - 2) {
                  return (
                    <span
                      key={`ellipsis-${pageNumber}`}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  );
                }

                return null;
              })}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10"
              >
                <span className="sr-only">Sonraki</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* İçerik Ekleme/Düzenleme Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {currentContent ? 'İçerik Düzenle' : 'Yeni İçerik Ekle'}
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
                        defaultValue={currentContent?.title || ''}
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
                        defaultValue={currentContent?.type || ''}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={handleTypeChange}
                      >
                        <option value="">Seçiniz</option>
                        <option value="video">Video</option>
                        <option value="audio">Ses</option>
                        <option value="document">Döküman</option>
                        <option value="interactive">Etkileşimli</option>
                        <option value="game">Oyun</option>
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
                        defaultValue={currentContent?.category || ''}
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
                        defaultValue={currentContent?.branch || ''}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Seçiniz</option>
                        <option value="Okul Öncesi">Okul Öncesi</option>
                        <option value="Müzik">Müzik</option>
                        <option value="İngilizce">İngilizce</option>
                        <option value="Görsel Sanatlar">Görsel Sanatlar</option>
                        <option value="Bilim">Bilim</option>
                        <option value="Matematik">Matematik</option>
                        <option value="Dil Gelişimi">Dil Gelişimi</option>
                        <option value="Sosyal Gelişim">Sosyal Gelişim</option>
                        <option value="Sağlık">Sağlık</option>
                        <option value="Beden Eğitimi">Beden Eğitimi</option>
                        <option value="Drama">Drama</option>
                        <option value="Bilişim">Bilişim</option>
                        <option value="Değerler Eğitimi">Değerler Eğitimi</option>
                        <option value="Çevre Eğitimi">Çevre Eğitimi</option>
                        <option value="Güvenlik">Güvenlik</option>
                        <option value="Beslenme">Beslenme</option>
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
                        defaultValue={currentContent?.ageGroup || ''}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Seçiniz</option>
                        <option value="3-4 yaş">3-4 yaş</option>
                        <option value="4-5 yaş">4-5 yaş</option>
                        <option value="5-6 yaş">5-6 yaş</option>
                        <option value="6-7 yaş">6-7 yaş</option>
                        <option value="7-8 yaş">7-8 yaş</option>
                      </select>
                    </div>
                    {
                      console.log("currentContent", currentContent)

                    }
                    {/* İki Kolonlu Alan: Yayın Tarihleri */}
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
                          defaultValue={
                            currentContent?.publishDateStudent
                              ? new Date(currentContent.publishDateStudent).toISOString().split("T")[0]
                              : ""
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                          defaultValue={
                            currentContent?.publishDateTeacher
                              ? new Date(currentContent.publishDateTeacher).toISOString().split("T")[0]
                              : ""
                          }
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
                          defaultChecked={currentContent?.isWeeklyContent || false}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          onChange={(e) => {
                            const dateContainer = document.getElementById('weeklyContentDateContainer');
                            if (dateContainer) {
                              dateContainer.classList.toggle('hidden', !e.target.checked);
                            }
                          }}
                        />
                        <span className="text-sm font-medium text-gray-700">Ek Materyal</span>
                      </label>
                    </div>

                    {/* Ek Materyal Tarih Aralığı - Sadece checkbox işaretliyse göster */}
                    <div id="weeklyContentDateContainer" className={`mt-2 ${currentContent?.isWeeklyContent || false ? '' : 'hidden'}`}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="weeklyContentStartDate" className="block text-sm font-medium text-gray-700">
                            Başlangıç Tarihi
                          </label>
                          <input
                            type="date"
                            name="weeklyContentStartDate"
                            id="weeklyContentStartDate"
                            defaultValue={currentContent?.weeklyContentStartDate || new Date().toISOString().split('T')[0]}
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
                            defaultValue={currentContent?.weeklyContentEndDate || new Date().toISOString().split('T')[0]}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Süre - Yalnızca video içerikleri için gösteriliyor */}
                    {/* {(currentContent?.type === 'video' || formType === 'video') && (
                      <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                          Süre (HH:MM:SS)
                        </label>
                        <input
                          type="text"
                          name="duration"
                          id="duration"
                          defaultValue={currentContent?.duration || '00:00:00'}
                          pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                          placeholder="00:00:00"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    )} */}

                    {/* Dosya Yükleme */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        İçerik Dosyası
                      </label>
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
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
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
                            PNG, JPG, PDF, DOC, MP4, MP3 ve benzeri dosyalar (maks. 50MB)
                          </p>
                          {/* Seçilen dosya bilgisi */}
                          <div className="mt-2 text-sm text-indigo-600 font-medium hidden" id="selected-file-info">
                            <div className="flex items-center justify-center">
                              <FileText className="w-4 h-4 mr-1" />
                              <span>secilendosya.pdf (2.3 MB)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Açıklama Alanı */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        İçerik Açıklaması
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows="3"
                        defaultValue={currentContent?.description || ''}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="İçerik hakkında kısa bir açıklama yazın..."
                      ></textarea>
                    </div>

                    {/* Etiketler */}
                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
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
                            defaultValue={currentContent?.tags?.join(', ') || ''}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="eğitim, müzik, matematik"
                          />
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Aramada kolaylık sağlamak için etiketler ekleyin</p>
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
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Yükleniyor...
                      </>
                    ) : (
                      currentContent ? 'Güncelle' : 'Ekle'
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isUploading}
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toplu İşlem Modal */}
      {bulkActionModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleBulkAction}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {bulkAction === 'update' ? 'Toplu Güncelleme' : 'Toplu Silme'}
                  </h3>

                  {bulkAction === 'update' && (
                    <div className="grid grid-cols-1 gap-4">
                      {/* Kategori */}
                      <div>
                        <label htmlFor="bulkCategory" className="block text-sm font-medium text-gray-700">
                          Kategori
                        </label>
                        <input
                          type="text"
                          name="bulkCategory"
                          id="bulkCategory"
                          placeholder="Kategoriyi güncellemek için doldurun"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      {/* Branş */}
                      <div>
                        <label htmlFor="bulkBranch" className="block text-sm font-medium text-gray-700">
                          Branş
                        </label>
                        <select
                          id="bulkBranch"
                          name="bulkBranch"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Seçiniz</option>
                          <option value="Okul Öncesi">Okul Öncesi</option>
                          <option value="Müzik">Müzik</option>
                          <option value="İngilizce">İngilizce</option>
                          <option value="Görsel Sanatlar">Görsel Sanatlar</option>
                          <option value="Bilim">Bilim</option>
                          <option value="Matematik">Matematik</option>
                          <option value="Dil Gelişimi">Dil Gelişimi</option>
                          <option value="Sosyal Gelişim">Sosyal Gelişim</option>
                          <option value="Sağlık">Sağlık</option>
                        </select>
                      </div>

                      {/* İçerik Türü */}
                      <div>
                        <label htmlFor="bulkType" className="block text-sm font-medium text-gray-700">
                          İçerik Türü
                        </label>
                        <select
                          id="bulkType"
                          name="bulkType"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Seçiniz</option>
                          <option value="video">Video</option>
                          <option value="audio">Ses</option>
                          <option value="document">Döküman</option>
                          <option value="interactive">Etkileşimli</option>
                          <option value="game">Oyun</option>
                        </select>
                      </div>

                      {/* Yaş Grubu */}
                      <div>
                        <label htmlFor="bulkAgeGroup" className="block text-sm font-medium text-gray-700">
                          Yaş Grubu
                        </label>
                        <select
                          id="bulkAgeGroup"
                          name="bulkAgeGroup"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Seçiniz</option>
                          <option value="3-4 yaş">3-4 yaş</option>
                          <option value="4-5 yaş">4-5 yaş</option>
                          <option value="5-6 yaş">5-6 yaş</option>
                          <option value="6-7 yaş">6-7 yaş</option>
                          <option value="7-8 yaş">7-8 yaş</option>
                        </select>
                      </div>

                      {/* Açıklama */}
                      <div>
                        <label htmlFor="bulkDescription" className="block text-sm font-medium text-gray-700">
                          Açıklama
                        </label>
                        <textarea
                          id="bulkDescription"
                          name="bulkDescription"
                          rows="3"
                          placeholder="Açıklamayı güncellemek için doldurun"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {bulkAction === 'delete' && (
                    <div className="text-sm text-gray-500">
                      <p className="mb-2">Seçilen <span className="font-bold">{selectedItems.length}</span> içeriği silmek istediğinize emin misiniz?</p>
                      <p className="text-red-500">Bu işlem geri alınamaz!</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${bulkAction === 'delete'
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                    disabled={isBulkUpdating}
                  >
                    {isBulkUpdating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        İşleniyor...
                      </>
                    ) : (
                      bulkAction === 'delete' ? 'Sil' : 'Güncelle'
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setBulkActionModalOpen(false)}
                    disabled={isBulkUpdating}
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* silmek için açılan modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="İçeriği silmek istediğinize emin misiniz?"
        description="Bu işlem geri alınamaz."
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      {/* seçilen checkbox sayısı 10'u geçince açılan modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Seçim Limiti</h2>
            <p className="text-sm text-gray-600 mb-4">
              En fazla <strong>10</strong> içerik seçebilirsiniz.
            </p>
            <button
              onClick={() => setShowLimitModal(false)}
              className="px-4 py-2 bg-indigo-600 cursor-pointer text-white rounded hover:bg-indigo-700"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
      {/* içeriği ön izleme */}
      {previewUrl && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-4xl bg-white p-4 shadow-lg rounded-lg z-50"
        >
          <h3 className="text-xl font-semibold mb-2">Önizleme</h3>
          <iframe
            src={previewUrl}
            className="w-full h-96 border border-gray-300 rounded-lg"
          />
          <button
            onClick={() => setPreviewUrl("")}
            className="absolute top-2 right-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
          >
            Kapat
          </button>
        </div>
      )}

    </div>
  );
};

export default ContentManagement;
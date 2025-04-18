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

"use client";

// components/ContentManagement.jsx
import {
  Book,
  Edit,
  FileText,
  Filter,
  FilterX,
  Image,
  Music,
  Search,
  Trash2,
  Video,
  ArrowLeft,
  HelpCircle
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import ConfirmModal from "@/components/ConfirmModal";
import { deleteAPI, getAPI, postAPI, updateAPI } from "@/services/fetchAPI";
import BulkContentUpload from "@/components/BulkContentUpload";
import SingleContentForm from "@/components/SingleContentForm";
import isValidDate from "@/components/dateValidation";
import useToastStore from "@/lib/store/toast";
import Toast from "@/components/toast";
import BulkUpdateForm from "@/components/BulkUpdateForm";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import Link from "next/link";
import ContentTable from "@/components/Dashboard/ContentTable";
import Pagination from "@/components/Dashboard/Pagination";
import HeaderActions from "@/components/Dashboard/HeaderActions";
import BulkActionsBar from "@/components/Dashboard/BulkActionsBar";
import PreviewModal from "@/components/Dashboard/PreviewModal";

// İçerik türleri
const contentTypes = [
  { id: "all", name: "Tümü" },
  { id: "video", name: "Video" },
  { id: "document", name: "Döküman" },
  { id: "interactive", name: "Etkileşimli" },
  { id: "game", name: "Oyun" },
  { id: "audio", name: "Ses" },
];

// Örnek içerik verileri
// Örnek içerik verileri - komponent dışında tanımlayın

const ContentManagement = () => {
  // State tanımlamaları
  const [previewUrl, setPreviewUrl] = useState("");
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [activeType, setActiveType] = useState("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formType, setFormType] = useState("");
  const [advancedFilterOptions, setAdvancedFilterOptions] = useState({
    ageGroup: "",
    status: "",
    publishDateStudent: "",
    publishDateTeacher: "",
    weeklyContent: false,
  });
  const [sortOption, setSortOption] = useState("newest");
  const [bulkMode, setBulkMode] = useState(false); // Toplu mod aktif mi?
  const [selectedItems, setSelectedItems] = useState([]); // Seçili öğe ID'leri
  const [bulkActionModalOpen, setBulkActionModalOpen] = useState(false); // Toplu işlem modalı açık mı?
  const [bulkAction, setBulkAction] = useState(""); // Hangi toplu işlem yapılacak: 'update' veya 'delete'
  const [isBulkUpdating, setIsBulkUpdating] = useState(false); // Toplu güncelleme işlemi devam ediyor mu?
  const showToast = useToastStore((state) => state.showToast);

  const filterMenuRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAPI("/api/contents"); // endpoint'i güncelle
      if (data) {
        setContents(data);
        setFilteredContents(data.data);
      }
    };

    fetchData();
  }, []);

  const handleTypeChange = (e) => {
    setFormType(e.target.value);
  };
  const handlePublish = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: true }),
      });

      if (!res.ok) throw new Error("Yayınlama başarısız");

      setContents((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isPublished: true } : item
        )
      );
    } catch (err) {
      console.error("Yayınlama hatası:", err);
    }
  };

  const handleUnpublish = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: false }),
      });

      if (!res.ok) throw new Error("Yayından kaldırma başarısız");

      setContents((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isPublished: false } : item
        )
      );
    } catch (err) {
      console.error("Yayından kaldırma hatası:", err);
    }
  };

  const branchOptions = [
    { label: "Matematik", value: "MATEMATIK" },
    { label: "Türkçe", value: "TURKCE" },
    { label: "Fen Bilgisi", value: "FEN_BILGISI" },
    { label: "Sosyal Bilgiler", value: "SOSYAL_BILGILER" },
    { label: "İngilizce", value: "INGILIZCE" },
  ];

  // Toplu işlem yapma
  const handleBulkAction = async (e) => {
    e.preventDefault();
    setIsBulkUpdating(true);
    try {
      // Toplu Silme
      if (bulkAction === "delete") {
        const idsToDelete = selectedItems
          .map((item) => (typeof item === "string" ? item : item?.id))
          .filter((id) => typeof id === "string" && id.trim() !== "");

        const fileKeysToDelete = contents
          .filter((item) => idsToDelete.includes(item.id))
          .map((item) => {
            const url = item?.fileUrl;
            if (!url) return null;
            const parts = url.split("/");
            return parts.length >= 2 ? `${parts.at(-2)}/${parts.at(-1)}` : null;
          })
          .filter((key) => typeof key === "string" && key.trim() !== "");

        if (idsToDelete.length === 0) {
          showToast("Silinecek geçerli içerik bulunamadı", "success");
          return;
        }

        const res = await fetch("/api/contents/bulk-delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: idsToDelete,
            fileKeys: fileKeysToDelete,
          }),
        });



        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData?.error || "Toplu silme işlemi başarısız.");
        }

        // İçerikleri state'den kaldır
        setContents((prev) => prev.filter((c) => !idsToDelete.includes(c.id)));

        // State'leri temizle
        setSelectedItems([]); // Seçimleri temizle
        setBulkMode(false); // Bulk mode'u kapat
        setBulkActionModalOpen(false); // Modalı kapat
        setBulkAction(null); // Bulk action'ı sıfırla
        setConfirmOpen(false); // Confirm modalı kapat

        showToast("İçerikler başarıyla silindi.", "success");
      }

      // Toplu Güncelleme
      if (bulkAction === "update") {
        const formData = new FormData(e.target);

        const updatedFields = {
          branch: formData.get("bulkBranch") || null,
          type: formData.get("bulkType") || null,
          ageGroup: formData.get("bulkAgeGroup") || null,
          description: formData.get("bulkDescription") || null,
        };

        // Boş alanları kaldır
        Object.keys(updatedFields).forEach((key) => {
          if (!updatedFields[key]) delete updatedFields[key];
        });

        if (Object.keys(updatedFields).length === 0) {
          showToast("Güncelleme için en az bir alan doldurmalısınız.", "error");
          return;
        }

        const contentsToUpdate = selectedItems.map((id) => ({
          id,
          ...updatedFields,
        }));

        console.log("Gönderilen veriler:", contentsToUpdate);

        const res = await fetch("/api/contents/bulk-update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contents: contentsToUpdate }),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result?.error || "Toplu güncelleme başarısız.");
        }

        // UI'daki içerikleri güncelle
        setContents((prev) =>
          prev.map((content) => {
            const updated = contentsToUpdate.find((c) => c.id === content.id);
            return updated ? { ...content, ...updatedFields } : content;
          })
        );

        showToast("İçerikler başarıyla güncellendi.", "success");
        setSelectedItems([]);
        setBulkMode(false);
        setIsModalOpen(false);

        // Modalı kapat
        setBulkActionModalOpen(false);

        // Bulk action'ı sıfırla
        setBulkAction(null);

      }
    } catch (error) {
      console.error("Toplu işlem hatası:", error);
      showToast(error.message, "error");
    } finally {
      setIsBulkUpdating(false);
    }
  };


  // Toplu seçimi temizleme
  const clearBulkSelection = () => {
    setSelectedItems([]);
  };

  const hasActiveFilters = () => {
    return (
      advancedFilterOptions.ageGroup !== "" ||
      advancedFilterOptions.status !== "" ||
      advancedFilterOptions.publishDateStudent !== "" ||
      advancedFilterOptions.publishDateTeacher !== "" ||
      advancedFilterOptions.weeklyContent ||
      activeType !== "all" ||
      searchTerm !== ""
    );
  };

  // İçerik filtreleme
  useEffect(() => {
    const filtered = contents.data?.filter((content) => {
      const title = (content.title || "").toLowerCase();

      const matchesSearch =
        searchTerm === "" || title.includes(searchTerm.toLowerCase());


      const matchesType =
        activeType === "all" ||
        !activeType ||
        (content.type && content.type === activeType);

      const matchesStatus =
        !advancedFilterOptions.status ||
        (content.status && content.status === advancedFilterOptions.status);

      const matchesAgeGroup =
        !advancedFilterOptions.ageGroup ||

        (content.ageGroup &&
          content.ageGroup === advancedFilterOptions.ageGroup);


      const studentDateFilter = advancedFilterOptions.publishDateStudent
        ? new Date(advancedFilterOptions.publishDateStudent)
        : null;
      const contentStudentDate = content.publishDateStudent
        ? new Date(content.publishDateStudent)
        : null;
      const matchesStudentDate = (() => {
        if (!studentDateFilter) return true;

        // weekly content'ler student tarihine göre filtrelenemez
        if (content.isWeeklyContent) return false;

        if (!contentStudentDate) return false;

        return contentStudentDate.toDateString() === studentDateFilter.toDateString();
      })();


      const teacherDateFilter = advancedFilterOptions.publishDateTeacher
        ? new Date(advancedFilterOptions.publishDateTeacher)
        : null;
      const matchesWeeklyContent =
        !advancedFilterOptions.weeklyContent || content.isWeeklyContent === true;


      const matchesTeacherDate = (() => {
        if (!teacherDateFilter) return true;

        if (advancedFilterOptions.weeklyContent) {
          const weeklyDate = content.weeklyContentStartDate
            ? new Date(content.weeklyContentStartDate)
            : null;

          return (
            weeklyDate &&
            weeklyDate.toDateString() === teacherDateFilter.toDateString()
          );
        } else {
          const teacherDate = content.publishDateTeacher
            ? new Date(content.publishDateTeacher)
            : null;

          return (
            teacherDate &&
            teacherDate.toDateString() === teacherDateFilter.toDateString()
          );
        }
      })();

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesAgeGroup &&
        matchesStudentDate &&
        matchesTeacherDate &&
        matchesWeeklyContent
      );
    });

    setFilteredContents(filtered);
    setCurrentPage(1); // sayfayı başa al
  }, [contents, searchTerm, activeType, advancedFilterOptions]);

  // Filtreleme menüsü dışına tıklandığında kapatma
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target)
      ) {
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
      case "video":
        return <Video className="w-5 h-5 text-blue-500" />;
      case "audio":
        return <Music className="w-5 h-5 text-green-500" />;
      case "document":
        return <FileText className="w-5 h-5 text-amber-500" />;
      case "interactive":
        return <Book className="w-5 h-5 text-purple-500" />;
      case "game":
        return <Image className="w-5 h-5 text-purple-500" />;
      default:
        return <HelpCircle className="w-5 h-5 text-red-500" />;
    }
  };

  // Status renklerini belirleme
  const getStatusColor = (status) => {
    switch (status) {
      case "Yüksek Katılım":
        return "bg-green-100 text-green-800";
      case "Orta Katılım":
        return "bg-yellow-100 text-yellow-800";
      case "Düşük Katılım":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Dosya yükleme işlemi
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Dosya bilgisi gösterimi
      const fileInfoElement = document.getElementById("selected-file-info");
      if (fileInfoElement) {
        fileInfoElement.classList.remove("hidden");
        const fileNameSpan = fileInfoElement.querySelector("span");
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
    e.currentTarget.classList.add("border-indigo-500", "bg-indigo-50");
  }, []);

  const getCleanFileName = (url) => {
    const filename = url.split("/").pop() || "";
    const parts = filename.split("-");
    return parts.length > 1 ? parts.slice(1).join("-") : filename;
  };

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-indigo-500", "bg-indigo-50");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-indigo-500", "bg-indigo-50");

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);

      // Dosya input değerini güncelleme (manuel olarak)
      const fileInput = document.getElementById("file-upload");
      if (fileInput) {
        // Dosya bilgisi gösterimi
        const fileInfoElement = document.getElementById("selected-file-info");
        if (fileInfoElement) {
          fileInfoElement.classList.remove("hidden");
          const fileNameSpan = fileInfoElement.querySelector("span");
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
  const handleSort = useCallback(
    (option) => {
      setSortOption(option);
      let sortedContents = [...filteredContents];

      switch (option) {
        case "newest":
          sortedContents.sort(
            (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
          );
          break;
        case "oldest":
          sortedContents.sort(
            (a, b) => new Date(a.publishDate) - new Date(b.publishDate)
          );
          break;
        case "title-asc":
          sortedContents.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "title-desc":
          sortedContents.sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          break;
      }

      setFilteredContents(sortedContents);
    },
    [filteredContents]
  );

  // İçerik ekleme/güncelleme modalını açma
  const openModal = (content = null) => {
    setCurrentContent(content);
    setIsModalOpen(true);
  };

  // İçerik silme
  const handleDeleteContent = (id) => {
    setSelectedId(id); // sadece id saklanıyor
    setConfirmOpen(true); // modal açılıyor
  };

  //aynı zamanda r2den de silme ekleniyor.
  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      // 1. Silinecek içeriği bul (state'ten)
      const contentToDelete = contents.find((item) => item.id === selectedId);

      // 2. Eğer fileUrl varsa önce R2'den sil
      if (contentToDelete?.fileUrl) {
        try {
          await fetch(
            `/api/file/delete?fileUrl=${encodeURIComponent(
              contentToDelete.fileUrl
            )}`,
            {
              method: "DELETE",
            }
          );
        } catch (err) {
          console.error("R2 dosyası silinirken hata oluştu:", err);
        }
      }

      // 3. İçeriği API'den sil
      await deleteAPI(`/api/contents/${selectedId}`);

      // 4. State'ten kaldır
      setContents((prevContents) =>
        prevContents.filter((item) => item.id !== selectedId)
      );

      // 5. Modal'ı kapat ve seçimi sıfırla
      setConfirmOpen(false);
      setSelectedId(null);

      setSelectedItems([]); // selectedItems'ı temizle
      setBulkMode(false); // bulk mode'u kapat
      setBulkActionModalOpen(false); // bulk action modalını kapat
      setBulkAction(null); // bulk action'ı sıfırla
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedId(null);
  };
  //dosyayı silme
  const handleDeleteFile = async () => {
    if (!currentContent?.fileUrl || !currentContent?.id) return;

    const fileKey = currentContent.fileUrl;

    try {
      // 🔸 1. R2'den dosyayı sil
      const res = await fetch(
        `/api/file/delete?fileUrl=${encodeURIComponent(fileKey)}`,
        {
          method: "DELETE",
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Dosya silinemedi");
      }

      // 🔸 2. API'de içerik verisini güncelle (fileUrl'i kaldır)
      await fetch(`/api/contents/${currentContent.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileUrl: null }),
      });

      // 🔸 3. State'te de fileUrl'i kaldır
      setCurrentContent((prev) => ({
        ...prev,
        fileUrl: null,
      }));
    } catch (err) {
      console.error("Silme hatası:", err);
      showToast("Dosya silinemedi. Lütfen tekrar deneyin.", "error");
    }
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

    // Dosya yükleme
    let fileUrl = null;

    const isNewFileSelected = selectedFile instanceof File;

    // Eğer yeni bir dosya seçildiyse ve mevcut içerikte dosya varsa önce eski dosyayı sil
    if (currentContent?.fileUrl && isNewFileSelected) {
      try {
        await fetch(
          `/api/file/delete?fileUrl=${encodeURIComponent(
            currentContent.fileUrl
          )}`,
          {
            method: "DELETE",
          }
        );
      } catch (err) {
        console.error("Eski dosya silinemedi:", err);
      }
    }

    //  Yeni dosya yüklenecekse  R2'ye gönder
    if (isNewFileSelected) {
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

        fileUrl = uploadJson.url || uploadJson.key;
      } catch (uploadErr) {
        console.error("Dosya yükleme hatası:", uploadErr);
        showToast("Dosya yüklenemedi. Lütfen tekrar deneyin.", "error");
        setIsUploading(false);
        return;
      }
    }

    //İçerik verisi
    const contentData = {
      title: formData.get("title"),
      type: contentType,
      branch: formData.get("branch"),
      ageGroup: formData.get("ageGroup"),
      publishDateStudent: formData.get("publishDateStudent")
        ? new Date(formData.get("publishDateStudent")).toISOString()
        : null,
      publishDateTeacher: formData.get("publishDateTeacher")
        ? new Date(formData.get("publishDateTeacher")).toISOString()
        : null,
      endDateStudent: formData.get("weeklyContentEndDate")?.trim()
        ? new Date(formData.get("weeklyContentEndDate")).toISOString()
        : null,

      endDateTeacher: formData.get("weeklyContentEndDate")?.trim()
        ? new Date(formData.get("weeklyContentEndDate")).toISOString()
        : null,
      isActive: formData.get("status") === "active",
      fileUrl: fileUrl !== null ? fileUrl : currentContent?.fileUrl || null,
      description: formData.get("description") || null,
      tags: tagsArray,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      Feedback: [],
    };

    try {
      let response;

      if (currentContent) {
        // Mevcut içeriği güncelle
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/contents/${currentContent.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(contentData),
          }
        );

        if (!response.ok) {
          throw new Error("İçerik güncellenemedi");
        }

        // State güncelle
        setContents((prev) =>
          prev.map((content) =>
            content.id === currentContent.id
              ? { ...content, ...contentData }
              : content
          )
        );
        console.log("İçerik güncellendi:", contentData);
      } else {
        //  Yeni içerik oluştur
        response = await postAPI("/api/contents", contentData);
        if (response) {
          setContents((prev) => [...prev, response]);
          console.log("Yeni içerik eklendi:", response);
        }
      }
    } catch (error) {
      console.error("İçerik işlemi sırasında hata oluştu:", error);
      showToast("İçerik kaydedilirken bir hata oluştu.", "error");
    } finally {
      //  Silme
      setIsUploading(false);
      setSelectedFile(null);
      setIsModalOpen(false);
      setCurrentContent(null);
    }
  };

  // İçeriği görüntüleme
  const viewContent = async (id) => {
    const content = contents.find((item) => item.id === id);
    if (!content) return;

    try {
      console.log("Dosya çağırılıyor:", content.fileUrl);

      const fileUrl = content.fileUrl;
      const response = await fetch(
        `/api/file/view?fileUrl=${fileUrl}`
      );

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
      showToast("Dosya görüntülenirken hata oluştu: ", error.message);
    }
  };
  // Sayfalama hesaplamaları
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredContents)
    ? filteredContents.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil(filteredContents?.length / itemsPerPage);

  // Sayfa değiştirme
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-7xl mx-auto mt-3 px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg shadow">
        {/* Başlık ve Ana İşlemler */}
        <HeaderActions
          contentTypes={contentTypes}
          activeType={activeType}
          setActiveType={setActiveType}
          bulkMode={bulkMode}
          setBulkMode={setBulkMode}
          openModal={openModal}
          setIsBulkUploadModalOpen={setIsBulkUploadModalOpen}
          setSelectedItems={setSelectedItems}
        />

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
          <div className="flex flex-wrap items-center justify-end gap-2 w-full">
            {/* Sıralama Butonu */}
            <div className="relative">
              <select
                className="cursor-pointer appearance-none flex items-center w-full px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                value={sortOption}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="title-asc">Başlık (A-Z)</option>
                <option value="title-desc">Başlık (Z-A)</option>
              </select>

              {/* Sağ oka benzeyen bir ikon simgesi */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>


            {/* Filtreleme Butonu ve Modal Menüsü */}
            <div className="relative max-w-full">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    console.log("Filtre butonuna tıklandı, mevcut durum:", filterMenuOpen);
                    setFilterMenuOpen(!filterMenuOpen);
                  }}
                  className="cursor-pointer flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap max-w-full overflow-hidden"
                >
                  {hasActiveFilters() ? (
                    <FilterX className="w-5 h-5 mr-2 text-indigo-600" />
                  ) : (
                    <Filter className="w-5 h-5 mr-2 text-gray-400" />
                  )}
                  Filtreler
                </button>
              </div>

              {/* Modal (Popup Menü) */}
              {filterMenuOpen && (
                <div
                  ref={filterMenuRef}
                  className="absolute top-full mt-2 right-0 w-[85vw] sm:w-80 max-w-[90vw] sm:max-w-[20rem] bg-white rounded-md shadow-lg z-50 border border-gray-200"
                >
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Filtreleme Seçenekleri</h3>

                    <div className="space-y-4">
                      {/* Yaş Grubu Filtresi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yaş Grubu</label>
                        <select
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 cursor-pointer focus:ring-indigo-500"
                          value={advancedFilterOptions.ageGroup}
                          onChange={(e) =>
                            setAdvancedFilterOptions({
                              ...advancedFilterOptions,
                              ageGroup: e.target.value,
                            })
                          }
                        >
                          <option value="">Tümü</option>
                          <option value="3-4 yaş">3-4 yaş</option>
                          <option value="4-5 yaş">4-5 yaş</option>
                          <option value="5-6 yaş">5-6 yaş</option>
                          <option value="6-7 yaş">6-7 yaş</option>
                        </select>
                      </div>

                      {/* Öğrenci Yayın Tarihi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Öğrenci Yayın Tarihi</label>
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                          value={advancedFilterOptions.publishDateStudent}
                          onChange={(e) =>
                            setAdvancedFilterOptions({
                              ...advancedFilterOptions,
                              publishDateStudent: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Öğretmen Yayın Tarihi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Öğretmen Yayın Tarihi</label>
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                          value={advancedFilterOptions.publishDateTeacher}
                          onChange={(e) =>
                            setAdvancedFilterOptions({
                              ...advancedFilterOptions,
                              publishDateTeacher: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Ek Materyal Checkbox */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="weeklyContent"
                          checked={advancedFilterOptions.weeklyContent}
                          onChange={(e) =>
                            setAdvancedFilterOptions({
                              ...advancedFilterOptions,
                              weeklyContent: e.target.checked,
                            })
                          }
                          className="cursor-pointer"
                        />
                        <label htmlFor="weeklyContent" className="text-sm text-gray-700">
                          Ek Materyal
                        </label>
                      </div>

                      {/* Butonlar */}
                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                          onClick={() =>
                            setAdvancedFilterOptions({
                              ageGroup: "",
                              status: "",
                              publishDateStudent: "",
                              publishDateTeacher: "",
                              weeklyContent: false,
                            })
                          }
                        >
                          Temizle
                        </button>
                        <button
                          className="px-3 py-2 text-indigo-600 hover:bg-indigo-100 rounded cursor-pointer"
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
          <ContentTable
            currentItems={currentItems}
            bulkMode={bulkMode}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            handlePublish={handlePublish}
            handleUnpublish={handleUnpublish}
            viewContent={viewContent}
            openModal={openModal}
            handleDeleteContent={handleDeleteContent}
            getContentIcon={getContentIcon}
            branchOptions={branchOptions}
          />
        </div>

        {/* Toplu İşlem Butonları */}
        {bulkMode && selectedItems.length > 0 && (
          <BulkActionsBar
            selectedItems={selectedItems}
            clearBulkSelection={clearBulkSelection}
            onBulkUpdate={() => {
              setBulkAction("update");
              setBulkActionModalOpen(true);
            }}
            onBulkDelete={() => {
              setBulkAction("delete");
              setBulkActionModalOpen(true);
            }}
          />
        )}


        {/* Sayfalama */}
        <div className="p-4 sm:p-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        </div>
      </div>

      {/* İçerik Ekleme/Düzenleme Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            {bulkMode && selectedItems.length > 1 ? (
              <BulkUpdateForm
                currentContent={currentContent}
                branchOptions={branchOptions}
                isBulkUpdating={isBulkUpdating}
                onSubmit={(e) => {
                  e.preventDefault();
                  setBulkAction("update");
                  handleBulkAction(e);
                }}
                onCancel={() => setIsModalOpen(false)}
              />

            ) : (
              <SingleContentForm
                setIsModalOpen={setIsModalOpen}
                currentContent={currentContent}
                setCurrentContent={setCurrentContent}
                setContents={setContents}

                branchOptions={branchOptions}
                handleFileChange={handleFileChange}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDrop={handleDrop}
                getStatusColor={getStatusColor}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            )}

          </div>
        </div>
      )}

      {/* Toplu İşlem Modal düzenleme */}

      {bulkActionModalOpen && bulkAction === "update" && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <BulkUpdateForm
              currentContent={currentContent}
              branchOptions={branchOptions}
              isBulkUpdating={isBulkUpdating}
              onSubmit={handleBulkAction}
              onCancel={() => setBulkActionModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* silmek için açılan modal */}
      {(confirmOpen || (bulkActionModalOpen && bulkAction === "delete")) && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <DeleteConfirmationModal
              selectedCount={
                bulkMode
                  ? selectedItems
                    .filter(item => typeof item === "string" && item.trim() !== "")
                    .length
                  : 1
              }
              isBulkDeleting={isBulkUpdating}
              onConfirm={() => {
                if (bulkMode) {
                  setBulkAction("delete");
                  handleBulkAction({ preventDefault: () => { } });
                } else {
                  handleConfirmDelete();
                }
              }}
              onCancel={() => {
                if (bulkMode && selectedItems.length > 1) {
                  setBulkActionModalOpen(false);
                } else {
                  handleCancelDelete();
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Toplu İçerik Yükleme Modal */}
      {isBulkUploadModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <BulkContentUpload
              setIsModalOpen={setIsBulkUploadModalOpen}
              setContents={setContents}
            />
          </div>
        </div>
      )}

      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Seçim Limiti
            </h2>
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
      <PreviewModal
        previewUrl={previewUrl}
        onClose={() => setPreviewUrl("")}
      />

      <Toast />
      <Link href="/" className="absolute top-2 xl:top-4 left-4 z-50">
        <ArrowLeft className="w-5 h-5  text-gray-700 hover:text-black cursor-pointer" />
      </Link>

    </div>
  );
};

export default ContentManagement;

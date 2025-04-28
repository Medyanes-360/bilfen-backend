"use client";

import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { deleteAPI, getAPI, postAPI, updateAPI } from "@/services/fetchAPI";
import BulkContentUpload from "@/components/BulkContentUpload";
import useToastStore from "@/lib/store/toast";
import Toast from "@/components/toast";
import Link from "next/link";
import ContentTable from "@/components/Dashboard/ContentTable";
import Pagination from "@/components/Dashboard/Pagination";
import HeaderActions from "@/components/Dashboard/HeaderActions";
import BulkActionsBar from "@/components/Dashboard/BulkActionsBar";
import PreviewModal from "@/components/Dashboard/PreviewModal";
import ContentFilters from "@/components/Dashboard/ContentFilters";
import ContentUploadModal from "@/components/Dashboard/ContentUploadModal";
import BulkActionModals from "@/components/Dashboard/BulkActionModals";
import useContentFilters from "@/components/Dashboard/hooks/useContentFilters";
import useBulkActions from "@/components/Dashboard/hooks/useBulkActions";
import { sortContents} from "@/utils/contentHelpers";
const ContentManagement = () => {
  // State tanımlamaları
  const [previewUrl, setPreviewUrl] = useState("");
  const [contents, setContents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formType, setFormType] = useState("");

  const {
    searchTerm,
    setSearchTerm,
    activeType,
    setActiveType,
    advancedFilterOptions,
    setAdvancedFilterOptions,
    filteredContents,
    setFilteredContents,
  } = useContentFilters(contents);

  const showToast = useToastStore((state) => state.showToast);

  const {
    bulkMode,
    setBulkMode,
    selectedItems,
    setSelectedItems,
    bulkActionModalOpen,
    setBulkActionModalOpen,
    bulkAction,
    setBulkAction,
    isBulkUpdating,
    setIsBulkUpdating,
    handleBulkAction,
    clearBulkSelection,
    setConfirmOpen,
    confirmOpen,
    isModalOpen,
    setIsModalOpen,
  } = useBulkActions({ contents, setContents, showToast });

  const [sortOption, setSortOption] = useState("newest");
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

  // Sıralama işlemi
  const handleSort = useCallback(
  (option) => {
    setSortOption(option);
    let content = [...filteredContents]
    const sortedContents = sortContents(content, option);
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
          activeType={activeType}
          setActiveType={setActiveType}
          bulkMode={bulkMode}
          setBulkMode={setBulkMode}
          openModal={openModal}
          setIsBulkUploadModalOpen={setIsBulkUploadModalOpen}
          setSelectedItems={setSelectedItems}
        />

        {/* Arama ve Filtreler */}
        <ContentFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          handleSort={handleSort}
          filterMenuOpen={filterMenuOpen}
          setFilterMenuOpen={setFilterMenuOpen}
          filterMenuRef={filterMenuRef}
          advancedFilterOptions={advancedFilterOptions}
          setAdvancedFilterOptions={setAdvancedFilterOptions}
          activeType={activeType}
          setCurrentPage={setCurrentPage}
        />

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
      <ContentUploadModal
        isModalOpen={isModalOpen}
        bulkMode={bulkMode}
        selectedItems={selectedItems}
        currentContent={currentContent}
        setCurrentContent={setCurrentContent}
        setContents={setContents}
        handleFileChange={handleFileChange}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        setIsModalOpen={setIsModalOpen}
        isBulkUpdating={isBulkUpdating}
        handleBulkAction={handleBulkAction}
        setBulkAction={setBulkAction}
      />

      <BulkActionModals
        bulkActionModalOpen={bulkActionModalOpen}
        bulkAction={bulkAction}
        bulkMode={bulkMode}
        selectedItems={selectedItems}
        isBulkUpdating={isBulkUpdating}
        currentContent={currentContent}
        handleBulkAction={handleBulkAction}
        handleConfirmDelete={handleConfirmDelete}
        handleCancelDelete={handleCancelDelete}
        setBulkActionModalOpen={setBulkActionModalOpen}
        setBulkAction={setBulkAction}
        confirmOpen={confirmOpen}
      />

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

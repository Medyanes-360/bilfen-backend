"use client";
// RecentOrders.jsx - Son içerik tablosu bileşeni (Hataları düzeltilmiş)
import React, { useState } from "react";
import { Play, Download } from "lucide-react";
import { contents, branches, ageGroups, contentTypes } from "./mockData";
import ConfirmModal from "@/components/ConfirmModal";
import RecentOrderHeader from "./RecentOrderHeader";
import RecentOrderFilter from "./RecentOrderFilter";
import RecentOrderTable from "./RecentOrderTable";
import RecentAddEditModal from "./RecentAddEditModal";
import RecentFooter from "./RecentFooter";

const RecentOrders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContent, setSelectedContent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); //modal açılması için
  const [selectedId, setSelectedId] = useState(null); //modal için id
  const [filters, setFilters] = useState({
    ageGroup: "Tümü",
    branch: "Tümü",
    type: "Tümü",
  });

  // İçerik formu için state
  const [formData, setFormData] = useState({
    title: "",
    type: "Video",
    ageGroup: "3-4 yaş",
    branch: "Okul Öncesi",
    publishDate: new Date().toISOString().split("T")[0],
    duration: "00:10:00",
  });

  // İçeriklerin durumu
  const [allContents, setAllContents] = useState(contents);

  // Form input değişimi
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // İçerik ekleme/düzenleme formu açma
  const openContentForm = (content = null) => {
    if (content) {
      setFormData({
        id: content.id,
        title: content.title,
        type: content.type,
        ageGroup: content.ageGroup,
        branch: content.branch,
        publishDate: content.publishDate,
        duration: content.duration,
        description: content.description || "",
      });
      setEditMode(true);
    } else {
      setFormData({
        title: "",
        type: "Video",
        ageGroup: "3-4 yaş",
        branch: "Okul Öncesi",
        publishDate: new Date().toISOString().split("T")[0],
        duration: "00:10:00",
        description: "",
      });
      setEditMode(false);
    }
    setSelectedContent(true);
  };

  // Form gönderimi
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      // Düzenleme işlemleri
      const updatedContents = allContents.map((content) =>
        content.id === formData.id ? { ...formData } : content
      );
      setAllContents(updatedContents);
      alert(`İçerik düzenlendi: ${formData.title}`);
    } else {
      // Ekleme işlemleri
      const newContent = {
        ...formData,
        id: Math.max(...allContents.map((c) => c.id), 0) + 1,
        completed: 0,
        opened: 0,
      };
      setAllContents([newContent, ...allContents]);
      alert(`Yeni içerik eklendi: ${formData.title}`);
    }
    setSelectedContent(null);
  };

  // İçerik silme
  const handleDeleteContent = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = () => {
    setAllContents(allContents.filter((content) => content.id !== selectedId));
    setConfirmOpen(false);
    setSelectedId(null);
  };
  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedId(null);
  };
  // const handleDeleteContent = (id) => {
  //   const confirmDelete = window.confirm('Bu içeriği silmek istediğinizden emin misiniz?');
  //   if (confirmDelete) {
  //     setAllContents(allContents.filter(content => content.id !== id));
  //     setConfirmOpen(true);
  //   }
  // };

  // İçerik verisi ve filtreleme
  const filteredContents = allContents.filter((content) => {
    // Arama terimine göre filtrele
    const matchesSearch =
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.ageGroup.toLowerCase().includes(searchTerm.toLowerCase());

    // Sekmelere göre filtrele
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "video" && content.type === "Video") ||
      (activeTab === "interactive" && content.type === "Etkileşimli İçerik");

    // Dropdown filtrelere göre filtrele
    const matchesAgeGroup =
      filters.ageGroup === "Tümü" || content.ageGroup === filters.ageGroup;
    const matchesBranch =
      filters.branch === "Tümü" || content.branch === filters.branch;
    const matchesType =
      filters.type === "Tümü" || content.type === filters.type;

    return (
      matchesSearch &&
      matchesTab &&
      matchesAgeGroup &&
      matchesBranch &&
      matchesType
    );
  });

  // En son eklenen içerikler (en fazla 5 tane)
  const recentContents = [...filteredContents].sort(
    (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
  );

  // İçerik durum göstergesi
  const getStatusBadge = (content) => {
    // completed veya opened değeri 0 ise, varsayılan değerler kullan
    const completed = content.completed || 0;
    const opened = content.opened || 1; // 0'a bölme hatasını önlemek için en az 1
    const completionRate = (completed / opened) * 100;

    if (completionRate >= 80) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Yüksek Katılım
        </span>
      );
    } else if (completionRate >= 50) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          Orta Katılım
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          Düşük Katılım
        </span>
      );
    }
  };

  // İçerik türü ikonu
  const getContentTypeIcon = (type) => {
    switch (type) {
      case "Video":
        return <Play size={16} className="text-blue-500" />;
      case "Doküman":
        return <Download size={16} className="text-orange-500" />;
      case "Oyun":
        return <div className="w-4 h-4 rounded-full bg-purple-500"></div>;
      case "Etkileşimli İçerik":
        return <div className="w-4 h-4 rounded-full bg-green-500"></div>;
      default:
        return null;
    }
  };

  // İçerik türüne göre renk sınıfı
  const getTypeClass = (type) => {
    switch (type) {
      case "Video":
        return "text-blue-500 bg-blue-50";
      case "Doküman":
        return "text-orange-500 bg-orange-50";
      case "Oyun":
        return "text-purple-500 bg-purple-50";
      case "Etkileşimli İçerik":
        return "text-green-500 bg-green-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  // Filtreleri sıfırla
  const resetFilters = () => {
    setFilters({
      ageGroup: "Tümü",
      branch: "Tümü",
      type: "Tümü",
    });
    setSearchTerm("");
  };

  return (
    <div className="bg-white shadow rounded-lg mt-6 mb-6 overflow-hidden">
      <RecentOrderHeader
        setActiveTab={setActiveTab}
        openContentForm={openContentForm}
        activeTab={activeTab}
      />
      {/* Arama ve Filtreleme */}
      <RecentOrderFilter
        filters={filters}
        setFilters={setFilters}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        setShowFilters={setShowFilters}
        showFilters={showFilters}
        resetFilters={resetFilters}
        ageGroups={ageGroups}
        branches={branches}
        contentTypes={contentTypes}
      />

      {/* İçerik Tablosu */}
      <RecentOrderTable
        recentContents={recentContents}
        handleDeleteContent={handleDeleteContent}
        getStatusBadge={getStatusBadge}
        openContentForm={openContentForm}
        getTypeClass={getTypeClass}
        getContentTypeIcon={getContentTypeIcon}
      />

      <RecentFooter filteredContents={filteredContents} />

      {/* İçerik Ekleme/Düzenleme Modal */}
      {selectedContent && (
        <RecentAddEditModal
          editMode={editMode}
          setSelectedContent={setSelectedContent}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          formData={formData}
          contentTypes={contentTypes}
          ageGroups={ageGroups}
          branches={branches}
        />
      )}
      <ConfirmModal
        isOpen={confirmOpen}
        title="İçeriği silmek istediğinize emin misiniz?"
        description={`Bu işlem geri alınamaz. `}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default RecentOrders;

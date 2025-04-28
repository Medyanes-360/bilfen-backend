// components/Dashboard/hooks/useBulkActions.js

import { useState } from "react";

const useBulkActions = ({ contents, setContents, showToast }) => {
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkActionModalOpen, setBulkActionModalOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        setSelectedItems([]);
        setBulkMode(false);
        setBulkActionModalOpen(false);
        setBulkAction(null);
        setConfirmOpen(false);
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
        setBulkActionModalOpen(false);
        setBulkAction(null);
      }
    } catch (error) {
      console.error("Toplu işlem hatası:", error);
      showToast(error.message, "error");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const clearBulkSelection = () => {
    setSelectedItems([]);
  };

  return {
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
  };
};

export default useBulkActions;

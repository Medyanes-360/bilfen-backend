import React from "react";
import { Edit, Trash2 } from "lucide-react";

const BulkActionsBar = ({
  selectedItems,
  clearBulkSelection,
  onBulkUpdate,
  onBulkDelete,
}) => {
  return (
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
          onClick={onBulkUpdate}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Edit className="w-4 h-4 mr-1" />
          Güncelle
        </button>
        <button
          onClick={onBulkDelete}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Sil
        </button>
      </div>
    </div>
  );
};

export default BulkActionsBar;

import React from "react";
import { Plus, List, X } from "lucide-react";

const HeaderActions = ({
  contentTypes,
  activeType,
  setActiveType,
  bulkMode,
  setBulkMode,
  openModal,
  setIsBulkUploadModalOpen,
  setSelectedItems,
}) => {
  return (
    <div className="border-b border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Başlık */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
        Son Eklenen İçerikler
      </h1>

      {/* Filtreler + Butonlar */}
      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:items-center sm:justify-between flex-wrap">
        {/* İçerik Türü Filtreleri */}
        <div className="w-full overflow-x-auto whitespace-nowrap hide-scrollbar pb-2 sm:pb-0">
          <div className="flex items-center gap-2">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition cursor-pointer ${activeType === type.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>


        {/* Yeni İçerik ve Toplu Butonları */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              if (bulkMode) {
                setIsBulkUploadModalOpen(true);
              } else {
                openModal();
              }
            }}
            className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {bulkMode ? (
              <>
                <List className="w-5 h-5 mr-1" />
                Toplu İçerik
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-1" />
                Yeni İçerik
              </>
            )}
          </button>

          <button
            onClick={() => {
              setBulkMode(!bulkMode);
              setSelectedItems([]);
            }}
            className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
  );


};

export default HeaderActions;

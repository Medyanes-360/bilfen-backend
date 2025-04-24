"use client";

import { PlusCircle } from "lucide-react";

const FilterControls = ({
  activeFilter,
  setActiveFilter,
  showCompletedOnly,
  setShowCompletedOnly,
  openNewTaskModal,
}) => {
  const filterButtons = [
    { label: "Tümü", value: "Tümü" },
    { label: "Yüksek", value: "Yüksek" },
    { label: "Orta", value: "Orta" },
    { label: "Düşük", value: "Düşük" },
  ];

  return (
    <div className="px-6 py-5 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Görevler</h3>
        <button
          onClick={openNewTaskModal}
          className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle size={16} className="mr-1" /> Yeni Görev
        </button>
      </div>


      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className=" flex flex-wrap items-center justify-between gap-3 min-h-[48px]">
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((button) => (
              <button
                key={button.value}
                onClick={() => setActiveFilter(button.value)}
                className={`px-2 md:px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${activeFilter === button.value
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {button.label}
              </button>
            ))}
          </div>
          <div className="flex justify-start sm:justify-end">
            <div className="flex items-center space-x-2">
              <input
                id="showCompletedOnly"
                type="checkbox"
                checked={showCompletedOnly}
                onChange={(e) => setShowCompletedOnly(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label
                htmlFor="showCompletedOnly"
                className="text-sm text-gray-700 leading-5"
              >
                {showCompletedOnly ? "Tamamlananlar" : "Tamamlananları göster"}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div >

  );
};

export default FilterControls;

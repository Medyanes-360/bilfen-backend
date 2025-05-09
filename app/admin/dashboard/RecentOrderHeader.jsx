import { Plus } from 'lucide-react'
import React from 'react'

const RecentOrderHeader = ({setActiveTab,activeTab,openContentForm}) => {
  return (
    <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Son Eklenen İçerikler
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${
                activeTab === "all"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100 "
              }`}
              onClick={() => setActiveTab("all")}
            >
              Tümü
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${
                activeTab === "video"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100 "
              }`}
              onClick={() => setActiveTab("video")}
            >
              Video
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${
                activeTab === "interactive"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100 "
              }`}
              onClick={() => setActiveTab("interactive")}
            >
              Etkileşimli
            </button>
            <button
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center cursor-pointer"
              onClick={() => openContentForm()}
            >
              <Plus size={16} className="mr-1" />
              Yeni İçerik
            </button>
          </div>
        </div>
      </div>

  )
}

export default RecentOrderHeader
import { ChevronDown, Filter, Search, X } from "lucide-react";
import React from "react";

const RecentOrderFilter = ({
  setSearchTerm,
  searchTerm,
  setShowFilters,
  showFilters,
  filters,
  setFilters,
  resetFilters,
  ageGroups,
  branches,
  contentTypes,
}) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2"
            placeholder="İçerik ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
              showFilters ? "bg-gray-100" : ""
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-1 text-gray-500" />
            Filtreler
            {showFilters ? (
              <ChevronDown size={16} className="ml-1" />
            ) : (
              <ChevronDown size={16} className="ml-1" />
            )}
          </button>

          {(filters.ageGroup !== "Tümü" ||
            filters.branch !== "Tümü" ||
            filters.type !== "Tümü") && (
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm cursor-pointer text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              onClick={resetFilters}
            >
              <X size={16} className="mr-1" />
              Filtreleri Temizle
            </button>
          )}
        </div>
      </div>

      {/* Gelişmiş filtre seçenekleri */}
      {showFilters && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label
              htmlFor="ageGroup"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Yaş Grubu
            </label>
            <select
              id="ageGroup"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
              value={filters.ageGroup}
              onChange={(e) =>
                setFilters({ ...filters, ageGroup: e.target.value })
              }
            >
              <option value="Tümü">Tüm Yaş Grupları</option>
              {ageGroups.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="branch"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Branş
            </label>
            <select
              id="branch"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
              value={filters.branch}
              onChange={(e) =>
                setFilters({ ...filters, branch: e.target.value })
              }
            >
              <option value="Tümü">Tüm Branşlar</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              İçerik Türü
            </label>
            <select
              id="type"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="Tümü">Tüm İçerik Türleri</option>
              {contentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentOrderFilter;

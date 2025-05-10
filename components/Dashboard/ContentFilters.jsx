"use client";

import { useRef, useEffect, useCallback } from "react";
import { Search, Filter, FilterX } from "lucide-react";

const ContentFilters = ({
    searchTerm,
    setSearchTerm,
    sortOption,
    handleSort,
    filterMenuOpen,
    setFilterMenuOpen,
    filterMenuRef,
    advancedFilterOptions,
    setAdvancedFilterOptions,
    activeType,
    setCurrentPage
}) => {
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
    // Gelişmiş filtreleme
    const applyAdvancedFilters = useCallback(() => {
        // Filtre menüsünü kapat
        setFilterMenuOpen(false);
        setCurrentPage(1); // İlk sayfaya dön
    }, [advancedFilterOptions]);

    return (
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
                {/* Sıralama */}
                <div className="relative">
                    <select
                        className="cursor-pointer appearance-none flex items-center w-full px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        value={sortOption}
                        onChange={(e) => handleSort(e.target.value)}
                    >
                        <option value="title-asc">Başlık (A-Z)</option>
                        <option value="title-desc">Başlık (Z-A)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Filtreler Butonu */}
                <div className="relative max-w-full">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
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

                    {filterMenuOpen && (
                        <div
                            ref={filterMenuRef}
                            className="absolute top-full mt-2 right-0 w-[85vw] sm:w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                        >
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Filtreleme Seçenekleri</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Yaş Grubu</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                            value={advancedFilterOptions.ageGroup}
                                            onChange={(e) =>
                                                setAdvancedFilterOptions({ ...advancedFilterOptions, ageGroup: e.target.value })
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
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
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
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
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
                                            className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
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
    );
};

export default ContentFilters;

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, paginate }) => {
  return (
    <nav className="flex justify-end">
      <div className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        {/* Önceki Butonu */}
        <button
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 cursor-pointer"
        >
          <span className="sr-only">Önceki</span>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Sayfa Numaraları */}
        {[totalPages]?.map((_, index) => {
          const pageNumber = index + 1;
          const isCurrentPage = pageNumber === currentPage;
          const isNearCurrentPage = Math.abs(pageNumber - currentPage) <= 1;
          const isFirstPage = pageNumber === 1;
          const isLastPage = pageNumber === totalPages;

          if (isFirstPage || isLastPage || isNearCurrentPage) {
            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`cursor-pointer relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:z-10 ${
                  isCurrentPage
                    ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </button>
            );
          }

          if (pageNumber === 2 && currentPage > 3) {
            return (
              <span
                key={`ellipsis-${pageNumber}`}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
                ...
              </span>
            );
          }

          if (
            pageNumber === totalPages - 1 &&
            currentPage < totalPages - 2
          ) {
            return (
              <span
                key={`ellipsis-${pageNumber}`}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
                ...
              </span>
            );
          }

          return null;
        })}

        {/* Sonraki Butonu */}
        <button
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 cursor-pointer"
        >
          <span className="sr-only">Sonraki</span>
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;

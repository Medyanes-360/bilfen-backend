import React from "react";

const RecentFooter = ({ filteredContents }) => {
  return (
    <div className="bg-white px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Toplam {filteredContents.length} içerik listeleniyor
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sayfa:</span>
          <button className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded">
            1
          </button>
          <button className="px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded">
            2
          </button>
          <button className="px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded">
            3
          </button>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Sonraki &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentFooter;

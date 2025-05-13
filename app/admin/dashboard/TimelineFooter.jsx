import React from "react";

const TimelineFooter = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50 text-xs md:text-sm">
      <div className="flex items-center space-x-4 mb-3 sm:mb-0">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-orange-500 mr-1.5"></div>
          <span className="text-gray-600">Bugün</span>
        </div>

        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-200 mr-1.5"></div>
          <span className="text-gray-600">Geçmiş</span>
        </div>

        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-100 mr-1.5"></div>
          <span className="text-gray-600">Gelecek</span>
        </div>
      </div>

      {/* <button className="text-orange-500 hover:text-orange-700 font-medium flex items-center transition-colors duration-200">
      Tüm içerik planını gör
      <ChevronRight size={16} className="ml-1" />
    </button> */}
    </div>
  );
};

export default TimelineFooter;

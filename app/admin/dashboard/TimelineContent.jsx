import { BookOpen, Calendar, FileText, Play, Users } from "lucide-react";
import React from "react";

const TimelineContent = ({
  handleViewDetails,
  viewContent,
  filteredDailyContent,
  getTypeClass,
  getContentTypeIcon,
  getContentTypeName,
  getBranchLabel,
  getAgeGroupColor,
  formatDate,
  selectedDate,
}) => {
  return (
    <>
      {/* Günün İçerikleri Başlık */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
            <Calendar size={18} className="mr-2 text-orange-500" />
            {formatDate(selectedDate).full}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Planlanmış İçerikler</p>
        </div>
        {/* <button
       onClick={openAddContentModal}
       className="mt-3 sm:mt-0 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
     >
       <Plus size={16} className="mr-2" />
       İçerik Ekle
     </button> */}
      </div>
      <div className="p-4 md:p-6">
        {filteredDailyContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDailyContent.map((content, index) => (
              <div
                key={content.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* İçerik Başlığı */}
                <div
                  className={`${getTypeClass(
                    content.type
                  )} px-4 py-3 flex items-center justify-between`}
                >
                  {/* İçerik Başlığı */}
                  <div
                    className={`${getTypeClass(
                      content.type
                    )} px-4 py-3 flex items-center justify-between`}
                  >
                    <div className="flex items-center">
                      {getContentTypeIcon(content.type)}
                      <span className="ml-2 font-semibold">
                        {getContentTypeName(content.type)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* İçerik Bilgileri */}
                <div className="p-4">
                  <h4 className="text-base font-semibold text-gray-900 mb-2">
                    {content.title}
                  </h4>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getAgeGroupColor(
                        content.ageGroup
                      )}`}
                    >
                      <Users size={12} className="mr-1" />
                      {content.ageGroup}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                      <BookOpen size={12} className="mr-1" />
                      {getBranchLabel(content.branch)}
                    </span>
                  </div>
                </div>

                {/* Butonlar */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => viewContent(content.id)}
                    className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Play size={14} className="mr-1" />
                    Görüntüle
                  </button>
                  <button
                    onClick={() => handleViewDetails(content)}
                    className="inline-flex items-center text-xs font-medium text-gray-600 hover:text-gray-800 cursor-pointer"
                  >
                    <FileText size={14} className="mr-1" />
                    Detaylar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full py-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              İçerik Bulunamadı
            </h3>
            <p className="text-sm text-gray-500 max-w-md mb-4">
              Bu tarihe ait planlanmış içerik bulunmamaktadır.
            </p>
            {/* <button
          onClick={openAddContentModal}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
        >
          <Plus size={16} className="mr-2" />
          İçerik Planla
        </button> */}
          </div>
        )}
      </div>
    </>
  );
};

export default TimelineContent;

import { X } from "lucide-react";
import React from "react";

const TimelineContentDetail = ({
  getContentTypeName,
  getBranchLabel,
  setIsModalOpen,
  currentContent,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl h-[60vh] overflow-y-auto p-6 sm:p-8">
        {/* X Butonu */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 transition cursor-pointer"
        >
          <X size={24} />
        </button>

        {/* Başlık */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          {currentContent.title}
        </h2>
        <div className="w-16 h-1 bg-orange-400 mx-auto rounded-full mb-6" />
        <div className="divide-y divide-gray-200 space-y-4 text-sm sm:text-base text-gray-800 leading-relaxed">
          {/* İçerik Bilgileri */}
          {[
            ["Tür", getContentTypeName(currentContent.type)],
            ["Yaş Grubu", currentContent.ageGroup],
            ["Branş", getBranchLabel(currentContent.branch)],
            ["Açıklama", currentContent.description || "Açıklama bulunmuyor."],
          ].map(([label, value], i) => (
            <div key={i} className="pt-4 first:pt-0 flex items-start">
              <span className="w-32 font-semibold text-gray-900 shrink-0">
                {label}:
              </span>
              <span className="text-gray-700">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineContentDetail;

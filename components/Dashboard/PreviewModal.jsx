import React from "react";

const PreviewModal = ({ previewUrl, onClose }) => {
  if (!previewUrl) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Arka plan */}
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      {/* İçerik */}
      <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        {/* Modal Kutusu */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-4xl w-full p-6">
          <h3 className="text-xl font-semibold mb-3">Önizleme</h3>

          <iframe
            src={previewUrl}
            className="w-full h-96 border border-gray-300 rounded-lg"
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;

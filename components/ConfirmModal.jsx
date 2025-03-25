import React from 'react';

const ConfirmModal = ({ isOpen, title, description, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
      <h2 className="text-lg font-semibold mb-2">{title || 'Emin misiniz?'}</h2>
      <p className="mb-4 text-gray-700">
        {description || 'Bu işlemi gerçekleştirmek istediğinize emin misiniz?'}
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
        >
          Vazgeç
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Sil
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default ConfirmModal;

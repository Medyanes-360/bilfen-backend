'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function BulkContentUpload({ setIsModalOpen }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setSelectedFiles(droppedFiles);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files', file));

    const res = await fetch('/api/contents/bulk-create', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();

    if (res.ok) {
      alert('Dosyalar başarıyla yüklendi');
      setSelectedFiles([]);
      setIsModalOpen(false);
    } else {
      alert('Hata: ' + (result.error || 'Bilinmeyen hata'));
    }

    setIsUploading(false);
  };

  return (
    <div className="inline-block  bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Toplu İçerik Yükle</h3>

          <label className="block text-sm font-medium text-gray-700">İçerik Dosyaları</label>

          <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="text-sm text-gray-600">
                <label htmlFor="file-upload" className="cursor-pointer text-indigo-600 hover:text-indigo-500">
                  <span>Dosya seçin</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.mp3,.mp4,.mov,.avi"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1 inline">veya sürükleyip bırakın</p>
              </div>
              <p className="text-xs text-gray-500">Maks. 50MB, birden fazla dosya yüklenebilir</p>

              {selectedFiles.length > 0 && (
                <ul className="mt-2 text-green-600 text-sm font-medium space-y-1">
                  {selectedFiles.map((file, i) => (
                    <li key={i}>• {file.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex justify-center rounded-md px-4 py-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700"
            disabled={isUploading}
          >
            {isUploading ? 'Yükleniyor...' : 'Yükle'}
          </button>
          <button
            type="button"
            className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => setIsModalOpen(false)}
          >
            Kapat
          </button>
        </div>
      </form>
    </div>
  );
}

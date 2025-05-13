import React, { useCallback } from "react";
import { Upload } from "lucide-react";
const FileUploadArea = ({
  selectedFile,
  setSelectedFile,
}) => {
  // Dosya yükleme işlemi
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "audio/mpeg",
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "application/zip", // added .zip mime type
        "application/x-zip-compressed",
      ];
      if (!allowedTypes.includes(file.type)) {
        showToast("Geçersiz dosya türü. Lütfen desteklenen bir dosya yükleyin.", "error");
        return;
      }
      setSelectedFile(file);

      // Dosya bilgisi gösterimi
      const fileInfoElement = document.getElementById("selected-file-info");
      if (fileInfoElement) {
        fileInfoElement.classList.remove("hidden");
        const fileNameSpan = fileInfoElement.querySelector("span");
        if (fileNameSpan) {
          const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
          fileNameSpan.textContent = `${file.name} (${fileSizeMB} MB)`;
        }
      }
    }
  }, []);

  // Dosya sürükle-bırak işlemi
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("border-indigo-500", "bg-indigo-50");
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-indigo-500", "bg-indigo-50");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-indigo-500", "bg-indigo-50");

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);

      // Dosya input değerini güncelleme (manuel olarak)
      const fileInput = document.getElementById("file-upload");
      if (fileInput) {
        // Dosya bilgisi gösterimi
        const fileInfoElement = document.getElementById("selected-file-info");
        if (fileInfoElement) {
          fileInfoElement.classList.remove("hidden");
          const fileNameSpan = fileInfoElement.querySelector("span");
          if (fileNameSpan) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            fileNameSpan.textContent = `${file.name} (${fileSizeMB} MB)`;
          }
        }
      }
    }
  }, []);

  return (
    <div
      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 hover:border-indigo-300 transition-colors duration-200"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-1 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="flex flex-col sm:flex-row items-center justify-center text-sm text-gray-600">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
          >
            <span>Dosya seçin</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.mp3,.mp4,.mov,.avi"
              onChange={handleFileChange}
            />
          </label>
          <p className="pl-1">veya sürükleyip bırakın</p>
        </div>
        <p className="text-xs text-gray-500">
          PNG, JPG, PDF, DOC, MP4, MP3 ve benzeri dosyalar (maks. 50MB)
        </p>
        {selectedFile && (
          <p className="mt-2 text-sm text-green-600 font-medium">
            Seçilen dosya: {selectedFile.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUploadArea;
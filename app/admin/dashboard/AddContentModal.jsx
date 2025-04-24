// AddContentModal.jsx
"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import { contentTypes, branches, ageGroups } from "./mockData";

const AddContentModal = ({
  selectedDate,
  existingContent = null,
  onClose,
  onSave,
}) => {
  const isEditMode = !!existingContent;

  const [formData, setFormData] = useState({
    title: existingContent?.title || "",
    type: existingContent?.type || "Video",
    ageGroup: existingContent?.ageGroup || "4-5 yaş",
    branch: existingContent?.branch || "Okul Öncesi",
    publishDate: existingContent?.publishDate || selectedDate,
    duration: existingContent?.duration || "00:15:00",
    description: existingContent?.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">
            {isEditMode ? "İçerik Düzenle" : "Yeni İçerik Ekle"}
          </h3>
          <button
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="title">
                İçerik Başlığı*
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="type"
                >
                  İçerik Türü*
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  {contentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="ageGroup"
                >
                  Yaş Grubu*
                </label>
                <select
                  id="ageGroup"
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  {ageGroups.map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="branch"
                >
                  Branş*
                </label>
                <select
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="duration"
                >
                  Süre* (HH:MM:SS)
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="text"
                  pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="publishDate"
              >
                Yayın Tarihi*
              </label>
              <input
                id="publishDate"
                name="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="description"
              >
                Açıklama
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                rows="3"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center"
            >
              <Save size={16} className="mr-1" />
              {isEditMode ? "Güncelle" : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContentModal;

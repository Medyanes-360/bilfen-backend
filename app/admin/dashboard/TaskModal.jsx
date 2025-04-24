"use client";

import { X } from "lucide-react";

const TaskModal = ({ editingTask, taskForm, handleInputChange, handleSubmit, setShowTaskModal }) => {
    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {editingTask ? "Görevi Düzenle" : "Yeni Görev Ekle"}
                    </h3>
                    <button
                        onClick={() => setShowTaskModal(false)}
                        className="text-gray-400 hover:text-gray-500 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Başlık
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                value={taskForm.title}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Açıklama
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                rows="3"
                                value={taskForm.description}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                                    Son Tarih
                                </label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    id="dueDate"
                                    required
                                    value={taskForm.dueDate}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                    Öncelik
                                </label>
                                <select
                                    name="priority"
                                    id="priority"
                                    required
                                    value={taskForm.priority}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="Düşük">Düşük</option>
                                    <option value="Orta">Orta</option>
                                    <option value="Yüksek">Yüksek</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Durum
                            </label>
                            <select
                                name="status"
                                id="status"
                                required
                                value={taskForm.status}
                                onChange={handleInputChange}
                                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="Beklemede">Beklemede</option>
                                <option value="Devam Ediyor">Devam Ediyor</option>
                                <option value="Tamamlandı">Tamamlandı</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-3">
                            <button
                                type="button"
                                onClick={() => setShowTaskModal(false)}
                                className="inline-flex items-center cursor-pointer px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 cursor-pointer py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                {editingTask ? "Güncelle" : "Ekle"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
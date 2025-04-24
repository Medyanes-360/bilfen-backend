"use client";

import { Check, ChevronDown, ChevronUp, Clock, AlertCircle, Edit, Trash2, Calendar } from "lucide-react";

const TaskItem = ({ task, toggleExpand, toggleTaskStatus, editTask, deleteTask }) => {
    const getPriorityClass = (priority) => {
        switch (priority) {
            case "Yüksek": return "bg-red-100 text-red-800";
            case "Orta": return "bg-yellow-100 text-yellow-800";
            case "Düşük": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Tamamlandı": return "bg-green-100 text-green-800";
            case "Devam Ediyor": return "bg-blue-100 text-blue-800";
            case "Beklemede": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Tamamlandı": return <Check size={16} />;
            case "Devam Ediyor": return <Clock size={16} />;
            case "Beklemede": return <AlertCircle size={16} />;
            default: return null;
        }
    };

    return (
        <li key={task.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                    {/* Sol buton */}
                    <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer ${task?.status === "Tamamlandı"
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-400"
                            }`}
                    >
                        {task?.status === "Tamamlandı" && <Check size={12} />}
                    </button>
                </div>
                {/* İçerik */}
                <div className="ml-3 flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        {/* Başlık + Aç/Kapat */}
                        <div
                            onClick={() => toggleExpand(task.id)}
                            className="cursor-pointer flex-1 min-w-0"
                        >
                            <div className="flex items-start md:items-center w-full min-w-0">
                                <h4
                                    className={`text-sm font-medium break-words w-full min-w-0 ${task.status === "Tamamlandı"
                                        ? "text-gray-500 line-through"
                                        : "text-gray-900"
                                        }`}
                                >
                                    {task.title}
                                </h4>
                                {task?.expanded ? (
                                    <ChevronUp size={16} className="ml-2 text-gray-500 flex-shrink-0" />
                                ) : (
                                    <ChevronDown size={16} className="ml-2 text-gray-500 flex-shrink-0" />
                                )}
                            </div>
                        </div>
                        {/* Etiketler */}
                        <div className="flex flex-wrap gap-2 flex-shrink-0">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getPriorityClass(task.priority)}`}>
                                {task.priority}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getStatusClass(task.status)}`}>
                                {getStatusIcon(task.status)}
                                <span className="ml-1">{task?.status}</span>
                            </span>
                        </div>
                    </div>
                    {/* Detaylar */}
                    {task.expanded && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">{task.description}</p>
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                                <Calendar size={14} className="mr-1" />
                                <span>Son Tarih: {task.dueDate}</span>
                            </div>
                            <div className="mt-3 flex space-x-2">
                                <button
                                    onClick={() => editTask(task)}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Edit size={12} className="mr-1" /> Düzenle
                                </button>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-red-300 text-red-700 bg-white hover:bg-red-50"
                                >
                                    <Trash2 size={12} className="mr-1" /> Sil
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
};

export default TaskItem;

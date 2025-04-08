"use client";

// TaskList.jsx - İşlevsel Görev Listesi bileşeni
import { deleteAPI, getAPI, patchAPI, postAPI } from "@/services/fetchAPI";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tümü");
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getAPI("/api/tasks");
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Form için state
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "Orta",
    status: "Beklemede",
    isCompleted: false,
  });

  // Görevi genişlet/daralt
  const toggleExpand = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, expanded: !task.expanded };
        }
        return task;
      })
    );
  };

  // Görev durumunu değiştir
  const toggleTaskStatus = async (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          isCompleted: !task.isCompleted,
          status: task.isCompleted ? "Beklemede" : "Tamamlandı",
        };
      }
      return task;
    });

    setTasks(updatedTasks);

    const updatedTask = updatedTasks.find((t) => t.id === id);

    // Veritabanına da gönder
    await patchAPI(`/api/tasks/${id}`, {
      isCompleted: updatedTask.isCompleted,
      status: updatedTask.status,
    });
  };

  // Görevi düzenle
  const editTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      isCompleted: task.isCompleted,
    });
    setShowTaskModal(true);
  };

  // Görevi sil
  const deleteTask = async (taskId) => {
    try {
      await deleteAPI(`/api/tasks/${taskId}`);
      fetchTasks(); // Refetch tasks after deletion to update the UI
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Yeni görev ekleme modalını aç
  const openNewTaskModal = () => {
    setEditingTask(null);
    setTaskForm({
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "Orta",
      status: "Beklemede",
    });
    setShowTaskModal(true);
  };

  // Form input değişimi
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Form gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { expanded, ...taskData } = taskForm; // Exclude 'expanded' from the task data

      if (editingTask) {
        // If editing, send a PATCH request
        const updatedTask = await patchAPI(
          `/api/tasks/${editingTask.id}`,
          taskData
        );
        if (updatedTask !== null) {
          // Check if updatedTask is not null
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          );
        } else {
          // If updatedTask is null, refetch tasks to ensure the list is updated
          fetchTasks();
        }
      } else {
        // If adding a new task, send a POST request
        const addedTask = await postAPI("/api/tasks", taskData);
        setTasks((prevTasks) => [addedTask, ...prevTasks]);
      }

      setShowTaskModal(false); // Close the modal after successful submission
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  // Filtreleme
  const getFilteredTasks = () => {
    let filtered = tasks;


    if (!showCompleted) {
      filtered = filtered.filter((task) => !task.isCompleted);

    }
    if (activeFilter !== "Tümü") {
      filtered = filtered.filter((task) => task.priority === activeFilter);
    }
    return filtered;
  };
  

  // Öncelik renkleri
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Yüksek":
        return "bg-red-100 text-red-800";
      case "Orta":
        return "bg-yellow-100 text-yellow-800";
      case "Düşük":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Durum renkleri
  const getStatusClass = (status) => {
    switch (status) {
      case "Tamamlandı":
        return "bg-green-100 text-green-800";
      case "Devam Ediyor":
        return "bg-blue-100 text-blue-800";
      case "Beklemede":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Durum ikonu
  const getStatusIcon = (status) => {
    switch (status) {
      case "Tamamlandı":
        return <Check size={16} />;
      case "Devam Ediyor":
        return <Clock size={16} />;
      case "Beklemede":
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  // Filtreleme butonları
  const filterButtons = [
    { label: "Tümü", value: "Tümü" },
    { label: "Yüksek", value: "Yüksek" },
    { label: "Orta", value: "Orta" },
    { label: "Düşük", value: "Düşük" },
  ];

  const filteredTasks = getFilteredTasks();

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Görevler</h3>
          <button
            onClick={openNewTaskModal}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle size={16} className="mr-1" />
            Yeni Görev
          </button>
        </div>
      </div>

      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((button) => (
              <button
                key={button.value}
                onClick={() => setActiveFilter(button.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  activeFilter === button.value
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
          <div className="flex items-center">
            <input
              id="showCompleted"
              name="showCompleted"
              type="checkbox"
              checked={showCompleted}
              onChange={() => setShowCompleted(!showCompleted)}

              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"

            />
            <label
              htmlFor="showCompleted"
              className="ml-2 text-sm text-gray-700"
            >
              Tamamlananları göster
            </label>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-gray-200">
        {filteredTasks?.length > 0 ? (
          filteredTasks?.map((task) => (
            <li key={task.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      task?.status === "Tamamlandı"
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-400"
                    }`}
                  >
                    {task?.status === "Tamamlandı" && <Check size={12} />}
                  </button>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div
                      onClick={() => toggleExpand(task.id)}
                      className="flex items-center cursor-pointer"
                    >
                      <h4
                        className={`text-sm font-medium ${
                          task.status === "Tamamlandı"
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {task?.title}
                      </h4>
                      {task?.expanded ? (
                        <ChevronUp size={16} className="ml-2 text-gray-500" />
                      ) : (
                        <ChevronDown size={16} className="ml-2 text-gray-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getPriorityClass(
                          task.priority
                        )}`}
                      >
                        {task?.priority}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getStatusClass(
                          task?.status
                        )}`}
                      >
                        {getStatusIcon(task.status)}
                        <span className="ml-1">{task?.status}</span>
                      </span>
                    </div>
                  </div>

                  {task.expanded && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {task.description}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        <span>Son Tarih: {task.dueDate}</span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => editTask(task)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Edit size={12} className="mr-1" />
                          Düzenle
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-red-300 text-red-700 bg-white hover:bg-red-50"
                        >
                          <Trash2 size={12} className="mr-1" />
                          Sil
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="px-6 py-8 text-center text-gray-500">
            <p>Gösterilecek görev bulunamadı.</p>
          </li>
        )}
      </ul>


      <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2 bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">
          <Check size={16} />
          <span>{tasks.filter((t) => t.isCompleted).length} tamamlandı</span>
        </div>
        <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-2 rounded-full">
          <Clock size={16} />
          <span>{tasks.filter((t) => !t.isCompleted).length} devam ediyor</span>

        </div>
      </div>

      {/* Görev Ekleme/Düzenleme Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingTask ? "Görevi Düzenle" : "Yeni Görev Ekle"}
              </h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                    <label
                      htmlFor="dueDate"
                      className="block text-sm font-medium text-gray-700"
                    >
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
                    <label
                      htmlFor="priority"
                      className="block text-sm font-medium text-gray-700"
                    >
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
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {editingTask ? "Güncelle" : "Ekle"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;

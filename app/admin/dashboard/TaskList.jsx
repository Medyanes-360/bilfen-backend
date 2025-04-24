"use client";

import { useEffect, useState } from "react";
import { getAPI, postAPI, patchAPI, deleteAPI } from "@/services/fetchAPI";
import useTaskFilterStore from "@/lib/store/useTaskFilterStore";
import TaskModal from "./TaskModal";
import TaskItem from "./TaskItem";
import FilterControls from "./FilterControls";
import FooterStats from "./TaskFooter";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Tümü");
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "Orta",
    status: "Beklemede",
    isCompleted: false,
  });

  const fetchTasks = async () => {
    try {
      const data = await getAPI("/api/tasks");
      setTasks(data);
    } catch (error) {
      console.error("Tasks fetch failed", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

  const toggleTaskStatus = async (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        const newIsCompleted = !task.isCompleted;
        return {
          ...task,
          isCompleted: newIsCompleted,
          status: newIsCompleted ? "Tamamlandı" : "Beklemede",
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    const updatedTask = updatedTasks.find((t) => t.id === id);
    await patchAPI(`/api/tasks/${id}`, {
      isCompleted: updatedTask.isCompleted,
      status: updatedTask.status,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskForm((prev) => {
      let updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "status") updated.isCompleted = value === "Tamamlandı";
      if (name === "isCompleted")
        updated.status = checked
          ? "Tamamlandı"
          : prev.status === "Tamamlandı"
            ? "Beklemede"
            : prev.status;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { expanded, ...rawData } = taskForm;

      // ✅ Durum ve isCompleted birbirini etkilesin:
      const taskData = {
        ...rawData,
        isCompleted:
          rawData.status === "Tamamlandı" ? true : rawData.isCompleted,
        status: rawData.isCompleted ? "Tamamlandı" : rawData.status,
      };

      if (editingTask) {
        const updatedTask = await patchAPI(
          `/api/tasks/${editingTask.id}`,
          taskData
        );

        if (updatedTask !== null) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          );
        } else {
          fetchTasks();
        }
      } else {
        const addedTask = await postAPI("/api/tasks", taskData);
        setTasks((prevTasks) => [addedTask, ...prevTasks]);
      }

      setShowTaskModal(false);
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

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

  const deleteTask = async (id) => {
    await deleteAPI(`/api/tasks/${id}`);
    fetchTasks();
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    if (showCompletedOnly) {
      filtered = filtered.filter((task) => task.isCompleted);
    }
    if (activeFilter !== "Tümü") {
      filtered = filtered.filter((task) => task.priority === activeFilter);
    }
    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="bg-white shadow rounded-lg">
      <FilterControls
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        showCompletedOnly={showCompletedOnly}
        setShowCompletedOnly={setShowCompletedOnly}
        openNewTaskModal={() => {
          setEditingTask(null);
          setTaskForm({
            title: "",
            description: "",
            dueDate: new Date().toISOString().split("T")[0],
            priority: "Orta",
            status: "Beklemede",
            isCompleted: false,
          });
          setShowTaskModal(true);
        }}
      />
      <ul
        className="divide-y divide-gray-200 overflow-y-auto"
        style={{ maxHeight: "400px", minHeight: "400px" }}
      >
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              toggleExpand={toggleExpand}
              toggleTaskStatus={toggleTaskStatus}
              editTask={editTask}
              deleteTask={deleteTask}
            />
          ))
        ) : (
          <p className="px-6 py-8 text-center text-gray-500">
            Gösterilecek görev bulunamadı.
          </p>
        )}
      </ul>

      <FooterStats tasks={tasks} />
      {/* Görev Ekleme/Düzenleme Modal */}
      {showTaskModal && (
        <TaskModal
          editingTask={editingTask}
          taskForm={taskForm}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setShowTaskModal={setShowTaskModal}
        />
      )}
    </div>
  );
};

export default TaskList;

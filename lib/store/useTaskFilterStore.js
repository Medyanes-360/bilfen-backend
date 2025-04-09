import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTaskFilterStore = create(
  persist(
    (set) => ({
      showCompleted: true, // ✅ Varsayılan olarak işaretli başlasın
      setShowCompleted: (value) => set({ showCompleted: value }),
    }),
    {
      name: "task-filters", // localStorage key
    }
  )
);

export default useTaskFilterStore;

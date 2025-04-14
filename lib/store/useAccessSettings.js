import { create } from "zustand";

const useAccessSettings = create((set, get) => ({
  studentDays: 5,
  teacherDays: 7,
  teacherDaysFuture: 0,
  isLoaded: false,

  fetchAccessSettings: async () => {
    try {
      const res = await fetch("/api/access-settings");
      const data = await res.json();
      set({
        studentDays: data.studentDays ?? 5,
        teacherDays: data.teacherDays ?? 7,
        teacherDaysFuture: data.teacherDaysFuture ?? 0,
        isLoaded: true,
      });
    } catch (err) {
      console.error("Erişim ayarları alınamadı:", err);
    }
  },

  setStudentDays: async (days) => {
    try {
      const res = await fetch("/api/access-settings", {
        method: "POST",
        body: JSON.stringify({ studentDays: days }),
      });
      const updated = await res.json();
      set({ studentDays: updated.studentDays });
    } catch (err) {
      console.error("Öğrenci gün güncelleme hatası:", err);
    }
  },

  setTeacherDays: async (days) => {
    try {
      const res = await fetch("/api/access-settings", {
        method: "POST",
        body: JSON.stringify({ teacherDays: days }),
      });
      const updated = await res.json();
      set({ teacherDays: updated.teacherDays });
    } catch (err) {
      console.error("Öğretmen gün güncelleme hatası:", err);
    }
  },

  setTeacherDaysFuture: async (days) => {
    try {
      const res = await fetch("/api/access-settings", {
        method: "POST",
        body: JSON.stringify({ teacherDaysFuture: days }),
      });
      const updated = await res.json();
      set({ teacherDaysFuture: updated.teacherDaysFuture });
    } catch (err) {
      console.error("Gelecek gün sayısı güncellenemedi:", err);
    }
  },
}));

export default useAccessSettings;

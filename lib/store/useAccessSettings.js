// /lib/store/useAccessSettings.js
import { create } from "zustand";

const useAccessSettings = create((set) => ({
  studentDays: 5,
  studentDaysFuture: 0,
  teacherDays: 7,
  teacherDaysFuture: 0,
  startedDate: null,
  endDate: null,
  isLoaded: false,

  fetchAccessSettings: async () => {
    try {
      const res = await fetch("/api/access-settings");
      const data = await res.json();
      set({
        studentDays: data.studentDays ?? 5,
        studentDaysFuture: data.studentDaysFuture ?? 0,
        teacherDays: data.teacherDays ?? 7,
        teacherDaysFuture: data.teacherDaysFuture ?? 0,
        startedDate: data.startedDate ?? null,
        endDate: data.endDate ?? null,
        isLoaded: true,
      });
    } catch (err) {
      console.error("❌ Erişim ayarları alınamadı:", err);
    }
  },

  // 🔄 Tek seferde tüm ayarları güncelle
  updateAllSettings: async (payload) => {
    try {
      const res = await fetch("/api/access-settings", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      set({
        studentDays: updated.studentDays ?? 5,
        studentDaysFuture: updated.studentDaysFuture ?? 0,
        teacherDays: updated.teacherDays ?? 7,
        teacherDaysFuture: updated.teacherDaysFuture ?? 0,
        startedDate: updated.startedDate ?? null,
        endDate: updated.endDate ?? null,
      });
    } catch (err) {
      console.error("❌ Ayarlar güncellenemedi:", err);
    }
  },
}));

export default useAccessSettings;

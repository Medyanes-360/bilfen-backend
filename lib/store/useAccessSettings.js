import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAccessSettings = create((set) => ({
  studentDays: null,
  teacherDays:null,
  isLoaded: false,

  fetchAccessSettings: async () => {
    const res = await fetch('/api/access-settings');
    const data = await res.json();
  
    // 👉 null kontrolü ekliyoruz
    if (data) {
      set({
        studentDays: data.studentDays,
        teacherDays: data.teacherDays,
        isLoaded: true
      });
    } else {
      // Eğer veri yoksa varsayılan oluşturulabilir veya sadece boş geçilir
      console.warn("Veritabanında erişim ayarı bulunamadı.");
    }
  },

  setStudentDays: async (days) => {
    set((state) => {
      const updated = { ...state, studentDays: days };
      fetch('/api/access-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      return { studentDays: days };
    });
  },

  setTeacherDays: async (days) => {
    set((state) => {
      const updated = { ...state, teacherDays: days };
      fetch('/api/access-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      return { teacherDays: days };
    });
  },
}));

export default useAccessSettings;

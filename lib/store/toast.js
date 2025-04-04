import { create } from 'zustand';

const useToastStore = create((set) => ({
  message: null,
  type: "success", // "success" | "error" | "info"
  show: false,
  showToast: (message, type = "success") => {
    set({ message, type, show: true });
    setTimeout(() => set({ show: false }), 2000);
  },
}));

export default useToastStore;

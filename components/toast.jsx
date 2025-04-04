import useToastStore from "@/lib/store/toast";

export default function Toast() {
  const { message, type, show } = useToastStore();

  if (!show) return null;

  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  return (
    <div className={`fixed top-5 right-5 z-[50] px-4 py-4 rounded shadow-md text-white ${bgColor}`}>
     {message}
    </div>
  );
}

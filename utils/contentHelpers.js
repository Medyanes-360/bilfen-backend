import { Book, FileText, Image, Music, Video, HelpCircle } from "lucide-react";
export const getContentIcon = (type) => {
  switch (type) {
    case "video":
      return <Video className="w-5 h-5 text-blue-500" />;
    case "audio":
      return <Music className="w-5 h-5 text-green-500" />;
    case "document":
      return <FileText className="w-5 h-5 text-amber-500" />;
    case "interactive":
      return <Book className="w-5 h-5 text-purple-500" />;
    case "game":
      return <Image className="w-5 h-5 text-purple-500" />;
    default:
      return <HelpCircle className="w-5 h-5 text-red-500" />;
  }
};
// Status renklerini belirleme
export const getStatusColor = (status) => {
  switch (status) {
    case "Yüksek Katılım":
      return "bg-green-100 text-green-800";
    case "Orta Katılım":
      return "bg-yellow-100 text-yellow-800";
    case "Düşük Katılım":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getCleanFileName = (url) => {
  const filename = url.split("/").pop() || "";
  const parts = filename.split("-");
  return parts.length > 1 ? parts.slice(1).join("-") : filename;
};

// Sıralama fonksiyonu
export function sortContents(contents, option) {
  const sorted = [...contents];
  switch (option) {
    case "newest":
      sorted.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
      break;
    case "oldest":
      sorted.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
      break;
    case "title-asc":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "title-desc":
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      break;
  }
  return sorted;
}

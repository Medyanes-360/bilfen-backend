import { CheckSquare, Edit, Eye, Trash2 } from "lucide-react";
import React from "react";

const ContentTable = ({
  currentItems,
  bulkMode,
  selectedItems,
  setSelectedItems,
  handlePublish,
  handleUnpublish,
  viewContent,
  openModal,
  handleDeleteContent,
  getContentIcon,
  branchOptions,
}) => {
  const handleCheckboxChange = (checked, contentId) => {
    if (checked) {
      if (selectedItems.length < 10) {
        setSelectedItems([...selectedItems, contentId]);
      }
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== contentId));
    }
  };

  const getMissingFields = (content) => {
    const missing = [];
    const isWeekly = content.isWeeklyContent;

    if (!content.ageGroup) missing.push("Yaş Grubu");
    if (!content.branch) missing.push("Branş");

    if (isWeekly) {
      if (!content.weeklyContentStartDate) missing.push("Yayın Tarihi");
    } else {
      if (!content.publishDateStudent) missing.push("Öğrenci Yayın Tarihi");
    }

    return missing;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {bulkMode && (
              <th className="px-3 py-2">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const allIds = currentItems.map((item) => item.id);
                    setSelectedItems(e.target.checked ? allIds : []);
                  }}
                  checked={
                    currentItems.length > 0 &&
                    currentItems.every((item) => selectedItems.includes(item.id))
                  }
                />
              </th>
            )}
            <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">İçerik</th>
            <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Branş</th>
            <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Yaş</th>
            <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Öğrenci Yayın</th>
            <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Öğretmen Yayın</th>
            <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Ek Materyal</th>
            <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Eksik</th>
            <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">İşlem</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentItems.map((content) => {
            const missingFields = getMissingFields(content);
            const isPublished = content.isPublished === true;
            const isPublishDisabled = missingFields.length > 0;

            return (
              <tr key={content.id}>
                {bulkMode && (
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(content.id)}
                      onChange={(e) =>
                        handleCheckboxChange(e.target.checked, content.id)
                      }
                      disabled={
                        selectedItems.length >= 10 &&
                        !selectedItems.includes(content.id)
                      }
                    />
                  </td>
                )}
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    {getContentIcon(content.type)}
                    <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      {content.title}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 text-sm text-gray-700">
                  {branchOptions.find((b) => b.value === content.branch)?.label || "-"}
                </td>
                <td className="px-3 py-2 text-sm text-gray-700">{content.ageGroup || "-"}</td>
                <td className="px-3 py-2 text-sm text-gray-700">
                  {content.publishDateStudent
                    ? new Date(content.publishDateStudent).toLocaleDateString("tr-TR")
                    : "-"}
                </td>
                <td className="px-3 py-2 text-sm text-gray-700">
                  {content.isWeeklyContent
                    ? content.weeklyContentStartDate
                      ? new Date(content.weeklyContentStartDate).toLocaleDateString("tr-TR")
                      : "-"
                    : content.publishDateTeacher
                      ? new Date(content.publishDateTeacher).toLocaleDateString("tr-TR")
                      : "-"}
                </td>
                <td className="px-3 py-2 text-sm text-gray-700">
                  {content.isWeeklyContent ? (
                    <CheckSquare className="w-4 h-4 text-green-500" />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-3 py-2 text-xs">
                  {missingFields.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-full sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]">
                      {missingFields.map((field, i) => (
                        <span
                          key={i}
                          className="bg-red-400 text-white text-xs px-2 py-1 rounded-md shadow-sm inline-flex items-center whitespace-nowrap"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <button
                      className={`px-2 py-1 text-xs rounded ${isPublished
                          ? "bg-blue-500 text-white"
                          : isPublishDisabled
                            ? "bg-neutral-200 text-gray-400 cursor-not-allowed"
                            : "bg-green-500 text-white"
                        }`}
                      disabled={!isPublished && isPublishDisabled}
                      title={
                        isPublished
                          ? "Yayından Kaldır"
                          : isPublishDisabled
                            ? `Eksik Alanlar: ${missingFields.join(", ")}`
                            : "Yayınla"
                      }
                      onClick={() => {
                        if (isPublished) {
                          handleUnpublish(content.id);
                        } else {
                          handlePublish(content.id);
                        }
                      }}
                    >
                      {isPublished ? "Kaldır" : "Yayınla"}
                    </button>
                    <button onClick={() => viewContent(content.id)}>
                      <Eye className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                    </button>
                    <button onClick={() => openModal(content)}>
                      <Edit className="w-4 h-4 text-indigo-500 hover:text-indigo-700" />
                    </button>
                    <button onClick={() => handleDeleteContent(content.id)}>
                      <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ContentTable;

// components/Dashboard/BulkActionModals.jsx
import BulkUpdateForm from "@/components/BulkUpdateForm";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

const BulkActionModals = ({
  bulkActionModalOpen,
  bulkAction,
  bulkMode,
  selectedItems,
  isBulkUpdating,
  currentContent,
  handleBulkAction,
  handleConfirmDelete,
  handleCancelDelete,
  setBulkActionModalOpen,
  setBulkAction,
  confirmOpen
}) => {

{/* Toplu İşlem Modal düzenleme */}
  return (
    <>
      {bulkActionModalOpen && bulkAction === "update" && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" />
            </div>

            <BulkUpdateForm
              currentContent={currentContent}
              isBulkUpdating={isBulkUpdating}
              onSubmit={handleBulkAction}
              onCancel={() => setBulkActionModalOpen(false)}
            />
          </div>
        </div>
      )}
      {/* silmek için açılan modal */}
      {(confirmOpen || (bulkActionModalOpen && bulkAction === "delete")) && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" />
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <DeleteConfirmationModal
              selectedCount={
                bulkMode
                  ? selectedItems.filter(item => typeof item === "string" && item.trim() !== "").length
                  : 1
              }
              isBulkDeleting={isBulkUpdating}
              onConfirm={() => {
                if (bulkMode) {
                  setBulkAction("delete");
                  handleBulkAction({ preventDefault: () => { } });
                } else {
                  handleConfirmDelete();
                }
              }}
              onCancel={() => {
                if (bulkMode && selectedItems.length > 1) {
                  setBulkActionModalOpen(false);
                } else {
                  handleCancelDelete();
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionModals;

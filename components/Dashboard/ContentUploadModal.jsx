import BulkUpdateForm from "@/components/BulkUpdateForm";
import SingleContentForm from "@/components/SingleContentForm";
import { branchOptions } from "../../app/constants/mockData"
const ContentUploadModal = ({
    isModalOpen,
    bulkMode,
    selectedItems,
    currentContent,
    setCurrentContent,
    setContents,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    selectedFile,
    setSelectedFile,
    setIsModalOpen,
    isBulkUpdating,
    handleBulkAction,
    setBulkAction
}) => {

    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 overflow-y-auto z-50">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {bulkMode && selectedItems.length > 1 ? (
                            <BulkUpdateForm
                                currentContent={currentContent}
                                branchOptions={branchOptions}
                                isBulkUpdating={isBulkUpdating}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setBulkAction("update")
                                    handleBulkAction(e);
                                }}
                                onCancel={() => setIsModalOpen(false)}
                            />
                        ) : (
                            <SingleContentForm
                                setIsModalOpen={setIsModalOpen}
                                currentContent={currentContent}
                                setCurrentContent={setCurrentContent}
                                setContents={setContents}
                                branchOptions={branchOptions}
                                handleFileChange={handleFileChange}
                                handleDragOver={handleDragOver}
                                handleDragLeave={handleDragLeave}
                                handleDrop={handleDrop}
                                selectedFile={selectedFile}
                                setSelectedFile={setSelectedFile}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ContentUploadModal;

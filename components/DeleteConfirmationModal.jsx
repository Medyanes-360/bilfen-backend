
export default function DeleteConfirmationModal({
    selectedCount = 1,
    isBulkDeleting,
    onConfirm,
    onCancel
}) {
    return (
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {selectedCount > 1 ? "Toplu Silme" : "İçerik Silme"}
                </h3>
                <div className="text-sm text-gray-500">
                    <p className="mb-2">
                        {selectedCount > 1 ? (
                            <>
                                Seçilen <span className="font-bold">{selectedCount}</span> içeriği silmek istediğinize emin misiniz?
                            </>
                        ) : (
                            "Bu içeriği silmek istediğinize emin misiniz?"
                        )}
                    </p>
                    <p className="text-red-500">Bu işlem geri alınamaz!</p>
                </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={onConfirm}
                    disabled={isBulkDeleting}
                >
                    {isBulkDeleting ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            İşleniyor...
                        </>
                    ) : (
                        "Sil"
                    )}
                </button>
                <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={onCancel}
                >
                    İptal
                </button>
            </div>
        </div>
    );
}
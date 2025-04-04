// components/BulkUpdateForm.jsx
export default function BulkUpdateForm({
    currentContent,
    branchOptions,
    isBulkUpdating,
    onSubmit,
    onCancel,
}) {
    return (
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form onSubmit={onSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Toplu Güncelleme
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Branş */}
                        <div>
                            <label
                                htmlFor="bulkBranch"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Branş
                            </label>
                            <select
                                id="bulkBranch"
                                name="bulkBranch"
                                defaultValue={currentContent?.branch || ""}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Seçiniz</option>
                                {branchOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* İçerik Türü */}
                        <div>
                            <label
                                htmlFor="bulkType"
                                className="block text-sm font-medium text-gray-700"
                            >
                                İçerik Türü
                            </label>
                            <select
                                id="bulkType"
                                name="bulkType"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Seçiniz</option>
                                <option value="video">Video</option>
                                <option value="audio">Ses</option>
                                <option value="document">Döküman</option>
                                <option value="interactive">Etkileşimli</option>
                                <option value="game">Oyun</option>
                            </select>
                        </div>

                        {/* Yaş Grubu */}
                        <div>
                            <label
                                htmlFor="bulkAgeGroup"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Yaş Grubu
                            </label>
                            <select
                                id="bulkAgeGroup"
                                name="bulkAgeGroup"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Seçiniz</option>
                                <option value="3-4 yaş">3-4 yaş</option>
                                <option value="4-5 yaş">4-5 yaş</option>
                                <option value="5-6 yaş">5-6 yaş</option>
                                <option value="6-7 yaş">6-7 yaş</option>
                                <option value="7-8 yaş">7-8 yaş</option>
                            </select>
                        </div>

                        {/* Açıklama */}
                        <div>
                            <label
                                htmlFor="bulkDescription"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Açıklama
                            </label>
                            <textarea
                                id="bulkDescription"
                                name="bulkDescription"
                                rows="3"
                                placeholder="Açıklamayı güncellemek için doldurun"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        disabled={isBulkUpdating}
                    >
                        {isBulkUpdating ? (
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
                            "Güncelle"
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
            </form>
        </div>
    );
}
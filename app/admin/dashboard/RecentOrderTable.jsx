import { Calendar, Clock, Edit, Eye, Plus, Trash2 } from 'lucide-react'
import React from 'react'

const RecentOrderTable = ({recentContents,handleDeleteContent,getStatusBadge,openContentForm,getTypeClass,getContentTypeIcon}) => {
  return (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                İçerik
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Yaş Grubu
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Yayın Tarihi
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Süre
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Durum
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentContents.length > 0 ? (
              recentContents.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 h-8 w-8 rounded-md ${getTypeClass(
                          content.type
                        )} flex items-center justify-center`}
                      >
                        {getContentTypeIcon(content.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {content.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {content.branch}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {content.ageGroup}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Calendar size={14} className="mr-1 text-gray-400" />
                      {content.publishDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Clock size={14} className="mr-1 text-gray-400" />
                      {content.duration}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(content)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Görüntüle"
                        onClick={() =>
                          alert(`İçerik görüntüleniyor: ${content.title}`)
                        }
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Düzenle"
                        onClick={() => openContentForm(content)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                        onClick={() => handleDeleteContent(content.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  <p className="text-base">Hiç içerik bulunamadı.</p>
                  <p className="mt-1 text-sm">
                    Filtreleri temizleyerek tüm içerikleri görüntüleyebilir veya
                    yeni bir içerik ekleyebilirsiniz.
                  </p>
                  <button
                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => openContentForm()}
                  >
                    <Plus size={16} className="mr-1" />
                    Yeni İçerik Ekle
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  )
}

export default RecentOrderTable
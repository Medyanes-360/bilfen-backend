'use client';

// TeacherFeedback.jsx - Öğretmen geri bildirimleri bileşeni (Hata düzeltilmiş)
import React, { useState } from 'react';
import { CheckCircle, XCircle, MessageCircle, User, ChevronDown, ChevronUp, Search, Filter, X, Clock } from 'lucide-react';
import { teacherFeedbacks, feedbackStatuses } from './mockData';

const TeacherFeedback = () => {
  // Öğretmen geri bildirimleri state'i
  const [allFeedbacks, setAllFeedbacks] = useState(teacherFeedbacks);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Tümü');
  const [searchTerm, setSearchTerm] = useState('');
  const [adminResponse, setAdminResponse] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Geri bildirimi genişletme/daraltma
  const toggleFeedback = (id) => {
    if (expandedFeedback === id) {
      setExpandedFeedback(null);
    } else {
      setExpandedFeedback(id);
      setAdminResponse(''); // Yeni bir geri bildirim açıldığında yanıt alanını temizle
    }
  };

  // Geri bildirimleri filtrele
  const filteredFeedbacks = allFeedbacks.filter(feedback => {
    // Arama terimine göre filtrele
    const matchesSearch = 
      feedback.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Durum filtresine göre filtrele
    const matchesStatus = filterStatus === 'Tümü' || feedback.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Geri bildirimi onayla
  const handleApproveFeedback = (id) => {
    setAllFeedbacks(allFeedbacks.map(feedback => {
      if (feedback.id === id) {
        return {
          ...feedback,
          status: 'Onaylandı',
          adminResponse: adminResponse || 'Geri bildiriminiz onaylandı.'
        };
      }
      return feedback;
    }));
    setExpandedFeedback(null);
  };

  // Geri bildirimi reddet
  const handleRejectFeedback = (id) => {
    setAllFeedbacks(allFeedbacks.map(feedback => {
      if (feedback.id === id) {
        return {
          ...feedback,
          status: 'Reddedildi',
          adminResponse: adminResponse || 'Geri bildiriminiz reddedildi.'
        };
      }
      return feedback;
    }));
    setExpandedFeedback(null);
  };

  // Geri bildirime yanıt ver
  const handleRespondFeedback = (id) => {
    if (!adminResponse.trim()) {
      alert("Lütfen bir yanıt yazın.");
      return;
    }
    
    setAllFeedbacks(allFeedbacks.map(feedback => {
      if (feedback.id === id) {
        return {
          ...feedback,
          status: 'Değerlendirildi',
          adminResponse: adminResponse
        };
      }
      return feedback;
    }));
    setExpandedFeedback(null);
  };

  // Durum bilgisine göre renk sınıfı ve ikon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'İnceleme Bekliyor':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock size={16} className="mr-1" />,
        };
      case 'Değerlendirildi':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <MessageCircle size={16} className="mr-1" />,
        };
      case 'Onaylandı':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle size={16} className="mr-1" />,
        };
      case 'Reddedildi':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle size={16} className="mr-1" />,
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <MessageCircle size={16} className="mr-1" />,
        };
    }
  };

  // Tarih formatı
  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Öğretmen Geri Bildirimleri</h3>
        <p className="mt-1 text-sm text-gray-500">Öğretmenlerden gelen içerik geri bildirimleri ve talepler</p>
      </div>

      {/* Arama ve Filtreleme */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Öğretmen, içerik veya mesaj ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center mt-3 sm:mt-0">
            <button
              className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 ${showFilters ? 'bg-gray-100' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="mr-2 text-gray-500" />
              Filtreler
              {showFilters ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
            </button>
          </div>
        </div>
        
        {/* Filtreleme seçenekleri */}
        {showFilters && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
                Durum
              </label>
              <select
                id="status"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Tümü">Tüm Durumlar</option>
                <option value="İnceleme Bekliyor">İnceleme Bekliyor</option>
                <option value="Değerlendirildi">Değerlendirildi</option>
                <option value="Onaylandı">Onaylandı</option>
                <option value="Reddedildi">Reddedildi</option>
              </select>
            </div>
            
            {/* Ek filtreler gerekirse buraya eklenebilir */}
          </div>
        )}
      </div>

      {/* Geri Bildirim Listesi */}
      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {filteredFeedbacks.length > 0 ? (
            filteredFeedbacks.map((feedback) => {
              const statusInfo = getStatusInfo(feedback.status);
              return (
                <li key={feedback.id} className="hover:bg-gray-50">
                  <div className="px-6 py-4">
                    <div 
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => toggleFeedback(feedback.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-1">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                            {feedback.teacherName.split(' ')[0][0]}
                            {feedback.teacherName.split(' ')[1][0]}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h4 className="text-sm font-medium text-gray-900">{feedback.teacherName}</h4>
                            <span
                              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium flex items-center ${statusInfo.color}`}
                            >
                              {statusInfo.icon}
                              {feedback.status}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            İçerik: <span className="font-medium">{feedback.contentTitle}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500 line-clamp-2 leading-5">
                            {feedback.message.length > 120 && expandedFeedback !== feedback.id
                              ? `${feedback.message.substring(0, 120)}...`
                              : feedback.message}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                        <span className="text-xs text-gray-500">{formatDate(feedback.date)}</span>
                        <div className="mt-2">
                          {expandedFeedback === feedback.id ? (
                            <ChevronUp size={16} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={16} className="text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Genişletilmiş bölüm */}
                    {expandedFeedback === feedback.id && (
                      <div className="mt-4 ml-14">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600">{feedback.message}</p>

                          {feedback.adminResponse && (
                            <div className="mt-3 pl-3 border-l-2 border-indigo-300">
                              <p className="text-xs text-gray-500 font-medium">Admin yanıtı:</p>
                              <p className="text-sm text-gray-700 mt-1">{feedback.adminResponse}</p>
                            </div>
                          )}

                          {!feedback.adminResponse && feedback.status !== 'Onaylandı' && feedback.status !== 'Reddedildi' && (
                            <div className="mt-3">
                              <textarea
                                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                                rows="2"
                                placeholder="Yanıt yazın..."
                                value={adminResponse}
                                onChange={(e) => setAdminResponse(e.target.value)}
                              ></textarea>
                              <div className="mt-2 flex justify-end space-x-2">
                                <button 
                                  onClick={() => handleApproveFeedback(feedback.id)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle size={16} className="mr-1" />
                                  Onayla
                                </button>
                                <button 
                                  onClick={() => handleRejectFeedback(feedback.id)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                >
                                  <XCircle size={16} className="mr-1" />
                                  Reddet
                                </button>
                                <button 
                                  onClick={() => handleRespondFeedback(feedback.id)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                  <MessageCircle size={16} className="mr-1" />
                                  Yanıtla
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })
          ) : (
            <li className="px-6 py-10 text-center text-gray-500">
              <p className="font-medium">Gösterilecek geri bildirim bulunamadı.</p>
              <p className="mt-1 text-sm">Filtreleri değiştirerek tekrar deneyin.</p>
            </li>
          )}
        </ul>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Toplam <span className="font-medium">{filteredFeedbacks.length}</span> geri bildirim 
            gösteriliyor (Tümü: {allFeedbacks.length})
          </p>
          <div className="mt-2 sm:mt-0 sm:flex sm:items-center">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <ChevronDown size={16} className="mr-1" />
              10 / sayfa
            </button>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px ml-3">
              <button className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Önceki
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-indigo-600">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                2
              </button>
              <button className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Sonraki
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherFeedback;
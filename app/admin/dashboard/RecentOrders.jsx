'use client';

// RecentOrders.jsx - Son içerik tablosu bileşeni (Hataları düzeltilmiş)
import React, { useState } from 'react';
import { Eye, Calendar, Clock, Edit, Trash2, Play, Download, Plus, Search, ChevronDown, Filter, X } from 'lucide-react';
import { contents, branches, ageGroups, contentTypes } from './mockData';
import ConfirmModal from '@/components/ConfirmModal';

const RecentOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false) //modal açılması için 
  const [selectedId, setSelectedId] = useState(null); //modal için id
  const [filters, setFilters] = useState({
    ageGroup: 'Tümü',
    branch: 'Tümü',
    type: 'Tümü'
  });

  // İçerik formu için state
  const [formData, setFormData] = useState({
    title: '',
    type: 'Video',
    ageGroup: '3-4 yaş',
    branch: 'Okul Öncesi',
    publishDate: new Date().toISOString().split('T')[0],
    duration: '00:10:00',

  });

  // İçeriklerin durumu
  const [allContents, setAllContents] = useState(contents);

  // Form input değişimi
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // İçerik ekleme/düzenleme formu açma
  const openContentForm = (content = null) => {
    if (content) {
      setFormData({
        id: content.id,
        title: content.title,
        type: content.type,
        ageGroup: content.ageGroup,
        branch: content.branch,
        publishDate: content.publishDate,
        duration: content.duration,
        description: content.description || ''
      });
      setEditMode(true);
    } else {
      setFormData({
        title: '',
        type: 'Video',
        ageGroup: '3-4 yaş',
        branch: 'Okul Öncesi',
        publishDate: new Date().toISOString().split('T')[0],
        duration: '00:10:00',
        description: ''
      });
      setEditMode(false);
    }
    setSelectedContent(true);
  };

  // Form gönderimi
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      // Düzenleme işlemleri
      const updatedContents = allContents.map(content => 
        content.id === formData.id ? { ...formData } : content
      );
      setAllContents(updatedContents);
      alert(`İçerik düzenlendi: ${formData.title}`);
    } else {
      // Ekleme işlemleri
      const newContent = {
        ...formData,
        id: Math.max(...allContents.map(c => c.id), 0) + 1,
        completed: 0,
        opened: 0
      };
      setAllContents([newContent, ...allContents]);
      alert(`Yeni içerik eklendi: ${formData.title}`);
    }
    setSelectedContent(null);
  };

  // İçerik silme
  const handleDeleteContent = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = () => {
    setAllContents(allContents.filter(content => content.id !== selectedId));
    setConfirmOpen(false);
    setSelectedId(null);
  };
  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedId(null);
  };
  // const handleDeleteContent = (id) => {
  //   const confirmDelete = window.confirm('Bu içeriği silmek istediğinizden emin misiniz?');
  //   if (confirmDelete) {
  //     setAllContents(allContents.filter(content => content.id !== id));
  //     setConfirmOpen(true);
  //   }
  // };
  
  // İçerik verisi ve filtreleme
  const filteredContents = allContents.filter(content => {
    // Arama terimine göre filtrele
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        content.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        content.ageGroup.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Sekmelere göre filtrele
    const matchesTab = activeTab === 'all' || 
                     (activeTab === 'video' && content.type === 'Video') ||
                     (activeTab === 'interactive' && content.type === 'Etkileşimli İçerik');
    
    // Dropdown filtrelere göre filtrele
    const matchesAgeGroup = filters.ageGroup === 'Tümü' || content.ageGroup === filters.ageGroup;
    const matchesBranch = filters.branch === 'Tümü' || content.branch === filters.branch;
    const matchesType = filters.type === 'Tümü' || content.type === filters.type;
    
    return matchesSearch && matchesTab && matchesAgeGroup && matchesBranch && matchesType;
  });
  
  // En son eklenen içerikler (en fazla 5 tane)
  const recentContents = [...filteredContents].sort((a, b) => 
    new Date(b.publishDate) - new Date(a.publishDate)
  );

  // İçerik durum göstergesi
  const getStatusBadge = (content) => {
    // completed veya opened değeri 0 ise, varsayılan değerler kullan
    const completed = content.completed || 0;
    const opened = content.opened || 1; // 0'a bölme hatasını önlemek için en az 1
    const completionRate = (completed / opened) * 100;
    
    if (completionRate >= 80) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Yüksek Katılım
        </span>
      );
    } else if (completionRate >= 50) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          Orta Katılım
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          Düşük Katılım
        </span>
      );
    }
  };

  // İçerik türü ikonu
  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'Video':
        return <Play size={16} className="text-blue-500" />;
      case 'Doküman':
        return <Download size={16} className="text-orange-500" />;
      case 'Oyun':
        return <div className="w-4 h-4 rounded-full bg-purple-500"></div>;
      case 'Etkileşimli İçerik':
        return <div className="w-4 h-4 rounded-full bg-green-500"></div>;
      default:
        return null;
    }
  };

  // İçerik türüne göre renk sınıfı
  const getTypeClass = (type) => {
    switch (type) {
      case 'Video':
        return 'text-blue-500 bg-blue-50';
      case 'Doküman':
        return 'text-orange-500 bg-orange-50';
      case 'Oyun':
        return 'text-purple-500 bg-purple-50';
      case 'Etkileşimli İçerik':
        return 'text-green-500 bg-green-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  // Filtreleri sıfırla
  const resetFilters = () => {
    setFilters({
      ageGroup: 'Tümü',
      branch: 'Tümü',
      type: 'Tümü'
    });
    setSearchTerm('');
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Son Eklenen İçerikler</h2>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${
                activeTab === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 '
              }`}
              onClick={() => setActiveTab('all')}
            >
              Tümü
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${
                activeTab === 'video' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 '
              }`}
              onClick={() => setActiveTab('video')}
            >
              Video
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${
                activeTab === 'interactive' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 '
              }`}
              onClick={() => setActiveTab('interactive')}
            >
              Etkileşimli
            </button>
            <button
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center cursor-pointer"
              onClick={() => openContentForm()}
            >
              <Plus size={16} className="mr-1" />
              Yeni İçerik
            </button>
          </div>
        </div>
      </div>

      {/* Arama ve Filtreleme */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2"
              placeholder="İçerik ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <button
              className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${showFilters ? 'bg-gray-100' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="mr-1 text-gray-500" />
              Filtreler
              {showFilters ? <ChevronDown size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
            </button>
            
            {(filters.ageGroup !== 'Tümü' || filters.branch !== 'Tümü' || filters.type !== 'Tümü') && (
              <button
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm cursor-pointer text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                onClick={resetFilters}
              >
                <X size={16} className="mr-1" />
                Filtreleri Temizle
              </button>
            )}
          </div>
        </div>
        
        {/* Gelişmiş filtre seçenekleri */}
        {showFilters && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="ageGroup" className="block text-xs font-medium text-gray-700 mb-1">
                Yaş Grubu
              </label>
              <select
                id="ageGroup"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                value={filters.ageGroup}
                onChange={(e) => setFilters({...filters, ageGroup: e.target.value})}
              >
                <option value="Tümü">Tüm Yaş Grupları</option>
                {ageGroups.map((age) => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="branch" className="block text-xs font-medium text-gray-700 mb-1">
                Branş
              </label>
              <select
                id="branch"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                value={filters.branch}
                onChange={(e) => setFilters({...filters, branch: e.target.value})}
              >
                <option value="Tümü">Tüm Branşlar</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="type" className="block text-xs font-medium text-gray-700 mb-1">
                İçerik Türü
              </label>
              <select
                id="type"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="Tümü">Tüm İçerik Türleri</option>
                {contentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* İçerik Tablosu */}
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
                      <div className={`flex-shrink-0 h-8 w-8 rounded-md ${getTypeClass(content.type)} flex items-center justify-center`}>
                        {getContentTypeIcon(content.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{content.title}</div>
                        <div className="text-sm text-gray-500">{content.branch}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{content.ageGroup}</div>
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
                        onClick={() => alert(`İçerik görüntüleniyor: ${content.title}`)}
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
                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                  <p className="text-base">Hiç içerik bulunamadı.</p>
                  <p className="mt-1 text-sm">Filtreleri temizleyerek tüm içerikleri görüntüleyebilir veya yeni bir içerik ekleyebilirsiniz.</p>
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

      <div className="bg-white px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Toplam {filteredContents.length} içerik listeleniyor
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sayfa:</span>
            <button className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded">1</button>
            <button className="px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded">2</button>
            <button className="px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded">3</button>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Sonraki &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* İçerik Ekleme/Düzenleme Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editMode ? 'İçerik Düzenle' : 'Yeni İçerik Ekle'}
              </h3>
              <button
                onClick={() => setSelectedContent(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Başlık
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    İçerik Türü
                  </label>
                  <select
                    name="type"
                    id="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {contentTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700">
                    Yaş Grubu
                  </label>
                  <select
                    name="ageGroup"
                    id="ageGroup"
                    required
                    value={formData.ageGroup}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {ageGroups.map((age) => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                    Branş
                  </label>
                  <select
                    name="branch"
                    id="branch"
                    required
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">
                    Yayın Tarihi
                  </label>
                  <input
                    type="date"
                    name="publishDate"
                    id="publishDate"
                    required
                    value={formData.publishDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Süre (HH:MM:SS)
                  </label>
                  <input
                    type="text"
                    name="duration"
                    id="duration"
                    required
                    pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                    placeholder="00:10:00"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Açıklama
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
                
                <div className="flex items-center justify-end space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedContent(null)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {editMode ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
      )}
       <ConfirmModal
        isOpen={confirmOpen}
        title="İçeriği silmek istediğinize emin misiniz?"
        description={`Bu işlem geri alınamaz. `}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default RecentOrders;
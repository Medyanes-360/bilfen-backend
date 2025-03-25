"use client"
// ActivityFeed.jsx - Aktivite akışı bileşeni
import React from 'react';
import { User, Clock, FileText, Check, X, AlertTriangle, Calendar, Upload, MessageCircle } from 'lucide-react';
import { teacherFeedbacks } from './mockData';

const ActivityFeed = () => {
  // Son aktiviteleri oluştur
  const activities = [
    ...teacherFeedbacks.map(feedback => ({
      id: `feedback-${feedback.id}`,
      type: 'feedback',
      title: `${feedback.teacherName} bir geri bildirim gönderdi`,
      description: feedback.message.length > 60 ? feedback.message.substring(0, 57) + '...' : feedback.message,
      time: feedback.date,
      status: feedback.status,
      icon: MessageCircle,
      iconColor: 'bg-blue-100 text-blue-600',
      content: feedback.contentTitle
    })),
    {
      id: 'content-1',
      type: 'content',
      title: 'Yeni içerik yüklendi',
      description: 'Mevsimler ve Hava Durumu video içeriği yüklendi.',
      time: '2025-03-22 09:45:12',
      icon: Upload,
      iconColor: 'bg-green-100 text-green-600',
    },
    {
      id: 'system-1',
      type: 'system',
      title: 'Otomatik arşivleme gerçekleşti',
      description: 'Geçen haftaya ait içerikler arşive taşındı.',
      time: '2025-03-21 23:00:00',
      icon: Calendar,
      iconColor: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'content-2',
      type: 'content',
      title: 'İçerik planlaması yapıldı',
      description: 'Önümüzdeki hafta için 12 yeni içerik planlandı.',
      time: '2025-03-21 14:20:45',
      icon: FileText,
      iconColor: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 'error-1',
      type: 'error',
      title: 'İçerik yüklenemedi',
      description: 'Bir içerik dosya boyutu sınırlaması nedeniyle yüklenemedi.',
      time: '2025-03-20 16:15:30',
      icon: AlertTriangle,
      iconColor: 'bg-red-100 text-red-600',
    },
  ];

  // Tarihe göre sırala (en yeniler üstte)
  const sortedActivities = [...activities].sort((a, b) => new Date(b.time) - new Date(a.time));

  // Zamanı formatla
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} dakika önce`;
    } else if (diffHours < 24) {
      return `${diffHours} saat önce`;
    } else if (diffDays < 7) {
      return `${diffDays} gün önce`;
    } else {
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  };

  // Duruma göre renk ve ikon belirle
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Onaylandı':
        return (
          <span className="flex items-center text-green-800 bg-green-100 px-2 py-1 rounded text-xs">
            <Check size={12} className="mr-1" />
            {status}
          </span>
        );
      case 'Reddedildi':
        return (
          <span className="flex items-center text-red-800 bg-red-100 px-2 py-1 rounded text-xs">
            <X size={12} className="mr-1" />
            {status}
          </span>
        );
      case 'İnceleme Bekliyor':
        return (
          <span className="flex items-center text-yellow-800 bg-yellow-100 px-2 py-1 rounded text-xs">
            <Clock size={12} className="mr-1" />
            {status}
          </span>
        );
      case 'Değerlendirildi':
        return (
          <span className="flex items-center text-blue-800 bg-blue-100 px-2 py-1 rounded text-xs">
            <Check size={12} className="mr-1" />
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Son Aktiviteler</h3>
        <p className="mt-1 text-sm text-gray-500">Sistemdeki son değişiklikler ve bildirimler</p>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200">
          {sortedActivities.slice(0, 5).map((activity) => {
            const IconComponent = activity.icon;
            
            return (
              <li key={activity.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 ${activity.iconColor} p-2 rounded-full`}>
                    <IconComponent size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <div className="flex items-center">
                        {activity.status && getStatusBadge(activity.status)}
                        <span className="ml-2 text-xs text-gray-500">{formatTime(activity.time)}</span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
                    {activity.content && (
                      <p className="mt-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        İçerik: {activity.content}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="px-6 py-4 border-t border-gray-200">
        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex justify-center">
          Tüm aktiviteleri görüntüle
        </a>
      </div>
    </div>
  );
};

export default ActivityFeed;
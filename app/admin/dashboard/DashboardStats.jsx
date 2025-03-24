"use client"
// DashboardStats.jsx - İstatistik kartları bileşeni
import React from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Clock,
  Calendar
} from 'lucide-react';
import { statistics } from './mockData';

const DashboardStats = () => {
  const stats = [
    {
      title: 'Aktif Öğrenciler',
      value: `${statistics.dailyActiveStudents}/${statistics.totalStudents}`,
      description: 'Günlük aktif öğrenci sayısı',
      icon: <Users size={24} className="text-blue-500" />,
      change: '+5%',
      changeType: 'increase',
    },
    {
      title: 'Tamamlanma Oranı',
      value: `${statistics.dailyCompletionRate}%`,
      description: 'Günlük görev tamamlama oranı',
      icon: <CheckCircle size={24} className="text-green-500" />,
      change: '+2%',
      changeType: 'increase',
    },
    {
      title: 'Ortalama Süre',
      value: statistics.averageTimePerContent,
      description: 'İçerik başına ortalama süre',
      icon: <Clock size={24} className="text-purple-500" />,
      change: '-0:30',
      changeType: 'decrease',
    },
    {
      title: 'En Aktif Gün',
      value: statistics.mostActiveDay,
      description: `${statistics.dailyStats.find(stat => stat.day === statistics.mostActiveDay)?.completionRate}% tamamlama oranı`,
      icon: <Calendar size={24} className="text-indigo-500" />,
      change: 'Sabit',
      changeType: 'neutral',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">{stat.value}</p>
              <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
          </div>
          <div className="mt-4 flex items-center">
            <span
              className={`inline-flex items-center text-xs ${
                stat.changeType === 'increase'
                  ? 'text-green-500'
                  : stat.changeType === 'decrease'
                  ? 'text-red-500'
                  : 'text-gray-500'
              }`}
            >
              {stat.change}
              {stat.changeType !== 'neutral' && (
                <span
                  className={`ml-1 ${
                    stat.changeType === 'increase' ? 'transform rotate-180' : ''
                  }`}
                >
                  {stat.changeType === 'increase' ? '↑' : stat.changeType === 'decrease' ? '↓' : ''}
                </span>
              )}
              <span className="ml-1 text-gray-500">geçen haftaya göre</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
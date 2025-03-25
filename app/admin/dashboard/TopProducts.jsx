"use client"
// TopProducts.jsx - En aktif içerik ve öğrenci bileşeni
import React from 'react';
import { 
  ChevronUp, 
  ChevronDown,
  Star,
  Clock,
  UserCheck
} from 'lucide-react';
import { contents, students } from './mockData';

const TopProducts = () => {
  // En aktif içerikler (tamamlanma oranına göre sıralanmış)
  const topContents = [...contents]
    .sort((a, b) => (b.completed / b.opened) - (a.completed / a.opened))
    .slice(0, 3);

  // En başarılı öğrenciler (tamamlama oranına göre sıralanmış)
  const topStudents = [...students]
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* En Aktif İçerikler */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">En Çok Tamamlanan İçerikler</h3>
          <p className="mt-1 text-sm text-gray-500">Tamamlama oranı en yüksek olan içerikler</p>
        </div>
        <div className="divide-y divide-gray-200">
          {topContents.map((content, index) => {
            const completionRate = (content.completed / content.opened * 100).toFixed(1);
            const isPositive = completionRate >= 75;

            return (
              <div key={content.id} className="px-6 py-4 flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg font-bold text-gray-500">
                  #{index + 1}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium text-gray-900">{content.title}</h4>
                    <span className="ml-2 flex items-center text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {content.type}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="flex items-center mr-4">
                      <UserCheck size={14} className="mr-1" />
                      {content.completed}/{content.opened} tamamlandı
                    </span>
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {content.duration}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${isPositive ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                  <span className="text-xl font-semibold text-gray-900">{completionRate}%</span>
                  <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    <span>{isPositive ? '+3%' : '-2%'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Tüm içerikleri görüntüle &rarr;
          </a>
        </div>
      </div>

      {/* En Başarılı Öğrenciler */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">En Başarılı Öğrenciler</h3>
          <p className="mt-1 text-sm text-gray-500">Görev tamamlama oranına göre</p>
        </div>
        <div className="divide-y divide-gray-200">
          {topStudents.map((student) => (
            <div key={student.id} className="px-6 py-4 flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-medium text-indigo-800">
                {student.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center">
                  <h4 className="text-sm font-medium text-gray-900">{student.fullName}</h4>
                  <span className="ml-2 flex items-center text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                    {student.age} yaş
                  </span>
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star size={14} className="mr-1 text-yellow-400" />
                    <span className="mr-4">Görev: {student.totalTasksCompleted}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>Süre: {student.activeTime} dk</span>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-green-500"
                    style={{ width: `${student.completionRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <span className="text-lg font-semibold text-green-600">{student.completionRate}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Tüm öğrencileri görüntüle &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
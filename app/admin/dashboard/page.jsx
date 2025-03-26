"use client"

// dashboard.jsx - Ana dashboard sayfası
import React from 'react';
import Layout from './Layout';
import DashboardStats from './DashboardStats';
import RecentOrders from './RecentOrders';
import TopProducts from './TopProducts';
import CustomerOverview from './CustomerOverview';
import ActivityFeed from './ActivityFeed';
import TaskList from './TaskList';
import TimelineComponent from './TimelineComponent';
import TeacherFeedback from './TeacherFeedback';

const Dashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Anaokulu Yönetim Paneli</h1>
          {/* <p className="mt-1 text-sm text-gray-500">
            Öğrenci, öğretmen, içerik ve istatistik yönetimi
          </p> */}
        </div>

        {/* İstatistik Kartları */}
        {/* <DashboardStats /> */}

        {/* Zaman Çizelgesi */}
        <TimelineComponent />

        {/* Grafik ve İçerik Bölümü */}
        {/* <RevenueChart /> */}

        {/* İçerikler Tablosu */}
        {/* <RecentOrders /> */}

        {/* Üst İçerikler ve Öğrenciler */}
        {/* <TopProducts /> */}

        {/* İstatistikler */}
        <CustomerOverview />

        {/* Alt Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Aktivite Akışı */}
          {/* <ActivityFeed /> */}

          {/* Görevler */}

        </div>
        <TaskList />

        {/* Öğretmen Geri Bildirimleri */}
        {/* <TeacherFeedback /> */}
      </div>
    </Layout>
  );
};

export default Dashboard;
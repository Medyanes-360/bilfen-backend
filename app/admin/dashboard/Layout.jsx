// Layout.jsx
'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { DashboardProvider } from './DashboardContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <DashboardProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Mobil sidebar */}
        <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white">
            <Sidebar mobile={true} closeSidebar={toggleSidebar} />
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <Sidebar />
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none p-6">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Layout;
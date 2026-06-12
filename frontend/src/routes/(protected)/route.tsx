import { CheckAuthApi } from '@/client/user.api';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/sidebar/Sidebar';
import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/(protected)')({
  beforeLoad: async () => {
    const isAuth = await CheckAuthApi();
    if (!isAuth)
      throw redirect({
        to: "/Login",
      });
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-[#0f0f0f]">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto pb-14 md:pb-0 bg-gray-50 dark:bg-[#0f0f0f]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

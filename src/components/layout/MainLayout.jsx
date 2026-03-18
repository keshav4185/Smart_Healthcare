import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 w-full lg:ml-64">
        <Navbar />
        <main className="mt-16 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

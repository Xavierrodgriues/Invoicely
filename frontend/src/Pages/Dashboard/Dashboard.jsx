// Dashboard.jsx
import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { HiMenu } from "react-icons/hi";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const res = JSON.parse(localStorage.getItem("user"));

  // Tabs array
  const tabs = [
    { name: "Profile", path: "/dashboard/profile" },
    { name: "View All", path: "/dashboard/view-all" },
    // Invoice tab only visible for Admin
    ...(res?.role === "Admin" ? [{ name: "Invoice", path: "/dashboard/invoice" }] : []),
    
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative z-20 lg:z-auto h-full w-64 p-6 bg-gray-900 bg-opacity-80 backdrop-blur-md text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-wide">
            Hello <span className="text-blue-600">{res?.role}!</span>
          </h1>
          {/* Close button on mobile */}
          <button
            className="lg:hidden text-white text-2xl"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg font-semibold"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-30 lg:hidden text-2xl text-gray-900 bg-white p-2 rounded-md shadow-md"
        onClick={() => setSidebarOpen(true)}
      >
        <HiMenu />
      </button>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-md min-h-[80vh]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
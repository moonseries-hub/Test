// src/components/Layout.jsx
import React, { useState } from "react";
import {
  LayoutDashboard,
  PlusSquare,
  Package,
  FolderTree,
  ShoppingCart,
  AlertTriangle,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  const [issuesOpen, setIssuesOpen] = useState(false);

  const menuItems = [
    { name: "Home / Dashboard", icon: <LayoutDashboard size={18} />, path: "/" },
    { name: "Add Product", icon: <PlusSquare size={18} />, path: "/add_product" },
    { name: "Store", icon: <Package size={18} />, path: "/store" },
    { name: "Category", icon: <FolderTree size={18} />, path: "/category" },
    { name: "Orders", icon: <ShoppingCart size={18} />, path: "/orders" },
    {
      name: "Issues",
      icon: <AlertTriangle size={18} />,
      subItems: [
        { name: "Raise Issue", path: "/issues/raise" },
        { name: "Track Issue", path: "/issues/track" },
      ],
    },
    { name: "Report", icon: <FileText size={18} />, path: "/report" },
    { name: "FAQ", icon: <HelpCircle size={18} />, path: "/faq" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-4 font-bold text-xl border-b border-blue-700">
          ASTRA
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                {item.subItems ? (
                  <>
                    <div
                      onClick={() => setIssuesOpen(!issuesOpen)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-800 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      {issuesOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </div>
                    {issuesOpen && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.subItems.map((sub) => (
                          <li key={sub.name}>
                            <Link
                              to={sub.path}
                              className="block p-2 rounded-lg hover:bg-blue-700 cursor-pointer text-sm"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-800 cursor-pointer"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-3">
          {/* Search */}
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-1/3">
            <Search className="text-gray-500 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search items, POs, vendors..."
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
              Admin
            </span>
            <Bell className="text-gray-600 cursor-pointer" size={20} />
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer"
            />
          </div>
        </header>

        {/* Outlet = child page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

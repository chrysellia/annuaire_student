import React from "react";
import SidebarLink from "./SidebarLink";

/**
 * Layout with Navbar (with profile bar), Sidebar, and Main Content.
 * Uses TailwindCSS CDN (Shade) for styling.
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-blue-700 text-white px-6 py-3 shadow">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-lg tracking-wide">Annuaire</span>
        </div>
        {/* Profile bar */}
        <div className="flex items-center space-x-3">
          <span className="hidden sm:inline">Hello, User</span>
          <img
            src="https://ui-avatars.com/api/?name=User&background=1e40af&color=fff"
            alt="Profile"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        </div>
      </nav>

      {/* Main content area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-blue-100 text-blue-900 px-4 py-6 hidden md:block shadow-lg">
          <ul className="space-y-4">
            <SidebarLink to="/" label="Dashboard" />
            <SidebarLink to="/students" label="Students" />
            <SidebarLink to="/courses" label="Courses" />
            <SidebarLink to="/settings" label="Settings" />
          </ul>
        </aside>
        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const UserProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="hidden sm:inline">Hello, {user?.username || "User"}</span>
        <img
          src={`https://ui-avatars.com/api/?name=${user?.username || "User"}&background=1e40af&color=fff`}
          alt="Profile"
          className="w-8 h-8 rounded-full border-2 border-white"
        />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50">
          <button
            className="block w-full text-left px-4 py-2 text-blue-700 hover:bg-blue-50"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;

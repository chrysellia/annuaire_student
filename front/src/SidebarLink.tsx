import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <li>
      <Link
        to={to}
        className={`block px-3 py-2 rounded transition font-medium ${
          isActive ? "bg-blue-700 text-white" : "hover:bg-blue-200"
        }`}
      >
        {label}
      </Link>
    </li>
  );
};

export default SidebarLink;

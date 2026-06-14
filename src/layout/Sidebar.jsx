import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css"

const Sidebar = () => {
  const links = [
    { path: "/", label: "Overview", icon: "🏠" },
    { path: "/products", label: "Products", icon: "📦" },
    { path: "/users", label: "Users", icon: "👥" },
    { path: "/crypto", label: "Crypto", icon: "₿" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        SimpleApp
      </div>

      <nav className="sidebar__nav">
        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar__icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
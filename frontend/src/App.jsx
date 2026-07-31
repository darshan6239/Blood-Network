import React from "react";
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import BrandMark from "./components/BrandMark.jsx";
import Home from "./pages/Home.jsx";
import UserPanel from "./pages/UserPanel.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import DistributorPanel from "./pages/DistributorPanel.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="topbar">
        <Link to="/" className="brand">
          <BrandMark size={22} color="#ffffff" />
          <span className="brand-name">LifeLink</span>
        </Link>
        <nav>
          <NavLink to="/user" className={({ isActive }) => (isActive ? "active" : "")}>
            Donor / User
          </NavLink>
          <NavLink to="/distributor" className={({ isActive }) => (isActive ? "active" : "")}>
            Blood Bank
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
            NGO / Admin
          </NavLink>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserPanel />} />
        <Route path="/distributor" element={<DistributorPanel />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdminPanel from "./components/AdminPanel";
import Employee from "./pages/Employee";
import User from "./pages/User";
import Menu from "./components/Menu";
import "./App.css"; 


function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<AdminPanel />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/user" element={<User />} />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

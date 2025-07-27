import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./components/DashBoard/Dashboard";
import Login from "./components/Login";
import Invoices from "./components/DashBoard/Invoices";
import StockManagement from "./components/DashBoard/StockManagement";
import Calendar from "./components/DashBoard/Calendar";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/Invoice" element={<Invoices/>} />
        <Route path="/dashboard/StockManagement" element={<StockManagement/>} />
        <Route path="/dashboard/Calendar" element={<Calendar/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

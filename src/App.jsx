import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import UserDetails from "./UserDetails";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-yellow-100 to-teal-800">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users/:id" element={<UserDetails />} />
      </Routes>
    </div>
  );
}

export default App;

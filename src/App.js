import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserManager from "./components/UserManager";
import RoleManager from "./components/RoleManager";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<UserManager />} />
      <Route path="/roles" element={<RoleManager />} />
    </Routes>
  </Router>
);

export default App;

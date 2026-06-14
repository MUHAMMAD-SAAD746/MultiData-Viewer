import { Routes, Route } from "react-router-dom";

import Sidebar from "./layout/Sidebar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Crypto from "./pages/Crypto";

import "./App.css"

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/users" element={<Users />} />
          <Route path="/crypto" element={<Crypto />} />

          <Route
            path="*"
            element={<h1>404 Page Not Found</h1>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
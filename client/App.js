import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import UploadForm from "./components/UploadForm";
import ProtectedRoutes from "./components/ProtectedRoutes";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/form" element={<UploadForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);

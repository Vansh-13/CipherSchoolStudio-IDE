import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// import './index.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer
  position="top-right"
  autoClose={3000}
  theme={localStorage.getItem("theme") === "dark" ? "dark" : "light"}
/>

    <App />
  </StrictMode>
);

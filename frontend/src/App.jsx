import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProjectList from "./components/Dashboard/ProjectList";
import ProjectEditor from "./components/Dashboard/ProjectEditor";
import { useContext, useState, useEffect } from "react";
import Header from "./components/Layout/Header";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const [theme, setTheme] = useState("dark");

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme; // adds 'light' or 'dark' class globally
  }, [theme]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className={`app-container ${theme}`}>
          <Header theme={theme} setTheme={setTheme} />
          <Routes>
            <Route path="/login" element={<Login theme={theme} />} />
            <Route path="/register" element={<Register theme={theme} />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <ProjectList theme={theme} />
                </PrivateRoute>
              }
            />
            <Route
              path="/editor/:id"
              element={
                <PrivateRoute>
                  <ProjectEditor theme={theme} />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

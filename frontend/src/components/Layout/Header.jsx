import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../Css/Header.css";

export default function Header({ theme, setTheme }) {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <header className={`header-container ${theme}`}>
      <div className="header-left" onClick={() => navigate("/dashboard")}>
        <div className="logo-circle">
          <span className="logo-text">CS</span>
        </div>
        <span className="project-name">CipherStudio IDE</span>
      </div>

      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {user ? (
          <div className="user-dropdown-container" ref={dropdownRef}>
            <div
              className="profile-circle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user.username[0].toUpperCase()}
            </div>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <strong>{user.username}</strong>
                  <span>{user.email}</span>
                </div>
                <button className="logout-button" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="auth-button login" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="auth-button register" onClick={() => navigate("/register")}>
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}

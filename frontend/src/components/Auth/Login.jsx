import { useState, useContext } from "react";
import { api } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "../Css/Login.css";

export default function Login({ theme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.user);
      toast.success("Login Successful", { theme });
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Invalid email or password";
      toast.error(message, { theme });
    }
  };

  return (
    <div className={`login-container ${theme}`}>
      <div className="login-left">
        <h1>Welcome to CipherStudio IDE</h1>
        <p>
          CipherStudio is your modern browser-based coding playground. Write,
          run, and manage projects like in a real IDE.
        </p>
        <div className="login-animation">
          <div className="code-line line1"></div>
          <div className="code-line line2"></div>
          <div className="code-line line3"></div>
        </div>
      </div>

      <div className="login-right">
        <form onSubmit={handleSubmit} className={`login-form ${theme}`}>
          <h1 className="login-title">Login</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`login-input ${theme}`}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`login-input ${theme}`}
              required
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className={`login-button ${theme}`}>Login</button>
          <p className="login-footer">
            Don't have an account?{" "}
            <Link className="login-link" to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

import { useState, useContext } from "react";
import { api } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "../Css/Register.css";

export default function Register({ theme }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.info("Creating your account...", { theme, autoClose: 1000 });

    try {
      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      login(data.token, data.user);
      toast.success("Registration Successful!", { theme, autoClose: 1000 });

      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const message =
        err.response?.data?.message || "Email already registered!";
      toast.error(message, { theme });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`register-container ${theme}`}>
      <form onSubmit={handleSubmit} className={`register-form ${theme}`}>
        <h1 className="register-title">Create Account</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`register-input ${theme}`}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`register-input ${theme}`}
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`register-input ${theme}`}
            required
          />
          <span
            className="toggle-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          className={`register-button ${theme}`}
          type="submit"
          disabled={loading}
        >
          {loading ? <div className="spinner"></div> : "Register"}
        </button>

        <p className="register-footer">
          Already have an account?{" "}
          <Link className="register-link" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

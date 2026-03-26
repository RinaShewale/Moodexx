import React, { useState } from 'react';
import FormGroup from '../components/FormGroup';
import "../Style/loginform.scss";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useauth';
import { Eye, EyeOff } from "lucide-react";

const Login = () => {

  const { loading, handleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // ❌ Email validation
    if (!email.includes("@")) {
      setError("Invalid email");
      return;
    }

    // ❌ Password empty check
    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");

    try {
      const res = await handleLogin({ email, password });

      console.log("LOGIN RESPONSE:", res);

      // ❌ FIX: remove strict success check
      if (!res) {
        setError("Login failed");
        return;
      }

      // ✅ optional: token store
      if (res.token) {
        localStorage.setItem("token", res.token);
      }

      navigate("/");

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  }

  return (
    <main className="LoginPage">
      <div className="formcontainer">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

          <FormGroup
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* 🔐 PASSWORD */}
          <div style={{ position: "relative" }}>
            <FormGroup
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"} // ✅ FIX works only if FormGroup fixed
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 👁 ICON */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "38px",
                cursor: "pointer",
                color: "#aaa"
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* ❌ ERROR */}
          {error && (
            <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
          )}

          <button className="primarybutton" type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
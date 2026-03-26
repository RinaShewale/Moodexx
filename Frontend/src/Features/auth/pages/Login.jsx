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

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await handleLogin({ email, password });

      if (!res || !res.success) {
        alert(res?.message || "Login failed");
        return;
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed");
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
              type={showPassword ? "text" : "password"}
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
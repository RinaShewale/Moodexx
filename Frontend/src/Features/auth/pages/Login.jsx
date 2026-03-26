import React, { useState, useEffect } from "react";
import FormGroup from "../components/FormGroup";
import "../Style/loginform.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useauth";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  // 🔹 STATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Randomized input names to prevent browser autofill
  const [emailName] = useState(`email-${Math.random()}`);
  const [passwordName] = useState(`password-${Math.random()}`);

  // 🔹 RESET STATE ON MOUNT (prevents ghost autofill)
  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");
  }, []);

  // 🔹 HANDLE LOGIN SUBMIT
  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.includes("@")) {
      setError("Invalid email");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    setError("");

    try {
      const res = await handleLogin({ email, password });
      if (!res) {
        setError("Login failed");
        return;
      }
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

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* 🔹 Hidden fake fields to trick browser autofill */}
          <input
            type="text"
            name="fakeuser"
            autoComplete="username"
            style={{ display: "none" }}
          />
          <input
            type="password"
            name="fakepass"
            autoComplete="new-password"
            style={{ display: "none" }}
          />

          {/* EMAIL */}
          <FormGroup
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            name={emailName} // randomized name prevents browser autofill
          />

          {/* PASSWORD */}
          <div style={{ position: "relative" }}>
            <FormGroup
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              name={passwordName} // randomized name prevents autofill
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "38px",
                cursor: "pointer",
                color: "#aaa",
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* ERROR */}
          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

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
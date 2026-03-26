import React, { useState } from 'react'
import FormGroup from '../components/FormGroup'
import "../Style/registerform.scss"
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hook/useauth'
import { Eye, EyeOff } from "lucide-react"

const Register = () => {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const { loading, handleRegister } = useAuth()
  const navigate = useNavigate()

  // 🔐 Strong Password Regex
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/

  async function handleSubmit(e) {
    e.preventDefault()

    // ❌ Email validation
    if (!email.includes("@")) {
      setError("Invalid email")
      return
    }

    // ❌ Password validation
    if (!passwordRegex.test(password)) {
      setError("Password must have uppercase, number & special character")
      return
    }

    setError("")

    try {
      const res = await handleRegister({ username, email, password })

      console.log("REGISTER RESPONSE:", res)

      if (!res) {
        alert("Register failed")
        return
      }

      alert("Register Success 🎉")
      navigate("/")

    } catch (err) {
      console.error(err)
      setError("Something went wrong")
    }
  }

  return (
    <main className="RegisterPage">
      <div className="formcontainer">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>

          <FormGroup
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

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
              type={showPassword ? "text" : "password"}  // ✅ FIX
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

          <button className='primarybutton' type="submit">
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </main>
  )
}

export default Register
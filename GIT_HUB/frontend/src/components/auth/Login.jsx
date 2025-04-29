import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { useNavigate, Link } from "react-router-dom"; // Added Link for navigation
import { Box, Button } from "@primer/react";
import "./auth.css";
import logo from "../../assets/github-mark-white.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });

      if (res.data?.token && res.data?.userId) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        setCurrentUser(res.data.userId);
        navigate("/"); // Redirect to home page
      } else {
        alert("Invalid response from server!");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Login Failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <Box sx={{ padding: 1 }}>
            <h2>Log In</h2>
          </Box>
        </div>

        <form className="login-box" onSubmit={handleLogin}>
          <div>
            <label className="label" htmlFor="Email">
              Email address
            </label>
            <input
              autoComplete="off"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="Password">
              Password
            </label>
            <input
              autoComplete="off"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            variant="primary"
            className="login-btn"
            disabled={loading}
            type="submit"
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>

        <div className="pass-box">
          <p>
            New to GitHub? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

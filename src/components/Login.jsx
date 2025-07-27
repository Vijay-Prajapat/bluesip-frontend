import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    };

    checkToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://bluesip-backend.onrender.com/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      setTimeout(() => setError(""), 4000); // Hide error after 4 seconds
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8"
      }}>
        <div style={{ fontSize: "1.2rem", fontWeight: "500", color: "#555" }}>
          Checking authentication...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f4f6f8",
      padding: "1rem"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'white',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Logo Section */}
        <div style={{
          background: 'linear-gradient(135deg, #2c3e50 0%, #524f4fff 100%)',
          padding: '0.8rem',
          textAlign: 'center'
        }}>
          <img
            src="./Black-Logo.png"
            alt="Logo"
            style={{
              width: '150px',
              filter: 'brightness(0) invert(1)',
              marginTop: '10px'
            }}
          />
        </div>

        {/* Form Section */}
        <div style={{ padding: '2rem' }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontSize: '1.8rem'
          }}>Login</h2>

          {error && (
            <div style={{
              backgroundColor: '#ffecec',
              color: '#ff4d4d',
              padding: '0.8rem',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#555',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#555',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #2c3e50 0%, #524f4fff 100%)',
                color: 'white',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.3s',
                textAlign: "center"
              }}
              onMouseOver={e => e.target.style.backgroundColor = '#1a1b1b'}
              onMouseOut={e => e.target.style.backgroundColor = '#2c3e50'}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

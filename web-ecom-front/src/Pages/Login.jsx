import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { GlobalContext } from '../Context/Context';
import api from '../Component/api';
import { FaEnvelope, FaLock, FaShoppingBag } from 'react-icons/fa';
import "./Login.css";

const Login = () => {
  let { state, dispatch } = useContext(GlobalContext);

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res = await api.post(`/login`, { email, password });
      if (res.status === 200) {
        dispatch({ type: "USER_LOGIN", user: res.data.user });
        setTimeout(() => {
          navigate("/home");
        }, 500);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.response?.data?.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      {/* Background decoration */}
      <div className="auth-bg-decoration">
        <div className="auth-circle auth-circle-1"></div>
        <div className="auth-circle auth-circle-2"></div>
        <div className="auth-circle auth-circle-3"></div>
      </div>

      <div className="auth-wrapper">
        {/* Left - Image Section */}
        <div className="auth-image-side">
          <div className="auth-image-overlay"></div>
          <img src="/images/login3.jpg" alt="Shopping" />
          <div className="auth-image-content">
            <FaShoppingBag className="auth-brand-icon" />
            <h1>Welcome Back!</h1>
            <p>Log in to access your account, track orders, and explore exclusive deals.</p>
            <div className="auth-stats">
              <div className="auth-stat">
                <span className="auth-stat-num">10K+</span>
                <span className="auth-stat-label">Products</span>
              </div>
              <div className="auth-stat">
                <span className="auth-stat-num">5K+</span>
                <span className="auth-stat-label">Customers</span>
              </div>
              <div className="auth-stat">
                <span className="auth-stat-num">99%</span>
                <span className="auth-stat-label">Satisfaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form Section */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <div className="auth-logo-icon">
                <FaShoppingBag />
              </div>
              <h2>Sign In</h2>
              <p>Enter your credentials to continue shopping</p>
            </div>

            <form onSubmit={loginUser} className="auth-form">
              <div className="auth-input-group">
                <label>Email Address</label>
                <div className="auth-input-wrapper">
                  <FaEnvelope className="auth-input-icon" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label>Password</label>
                <div className="auth-input-wrapper">
                  <FaLock className="auth-input-icon" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="auth-spinner"></span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <p className="auth-switch-text">
              Don't have an account?{' '}
              <Link to="/sign-up" className="auth-switch-link">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

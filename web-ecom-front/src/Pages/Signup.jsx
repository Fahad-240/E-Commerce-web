import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { GlobalContext } from '../Context/Context';
import api from '../Component/api';
import { FaUser, FaEnvelope, FaLock, FaShoppingBag } from 'react-icons/fa';
import "./Signup.css";

const Signup = () => {
  let { state } = useContext(GlobalContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res = await api.post(`/sign-up`, {
        firstName,
        lastName,
        email,
        password,
      });
      if (res.status === 201) {
        alert("Account created successfully! Please login.");
      }
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      alert(error.response?.data?.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page signup-page">
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
            <h1>Join Us Today!</h1>
            <p>Create your account and start exploring thousands of amazing products at unbeatable prices.</p>
            <div className="auth-stats">
              <div className="auth-stat">
                <span className="auth-stat-num">Free</span>
                <span className="auth-stat-label">Shipping</span>
              </div>
              <div className="auth-stat">
                <span className="auth-stat-num">24/7</span>
                <span className="auth-stat-label">Support</span>
              </div>
              <div className="auth-stat">
                <span className="auth-stat-num">Easy</span>
                <span className="auth-stat-label">Returns</span>
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
              <h2>Create Account</h2>
              <p>Fill in the details to get started</p>
            </div>

            <form onSubmit={registerUser} className="auth-form">
              <div className="auth-name-row">
                <div className="auth-input-group">
                  <label>First Name</label>
                  <div className="auth-input-wrapper">
                    <FaUser className="auth-input-icon" />
                    <input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="auth-input-group">
                  <label>Last Name</label>
                  <div className="auth-input-wrapper">
                    <FaUser className="auth-input-icon" />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

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
                    placeholder="Create a password"
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
                  "Create Account"
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <p className="auth-switch-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

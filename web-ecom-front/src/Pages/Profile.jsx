import React, { useEffect, useState, useContext } from "react";
import api from "../Component/api";
import { GlobalContext } from "../Context/Context";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import { useNavigate } from "react-router";
import { FaUserEdit, FaEnvelope, FaIdBadge, FaSignOutAlt } from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const navigate = useNavigate();

  const user = state.user;

  useEffect(() => {
    if (state.isLogin === false) {
      navigate("/login");
    }
  }, [state.isLogin, navigate]);


  const handleLogout = async () => {
    try {
      await api.post("/logout");
      dispatch({ type: "USER_LOGOUT" });
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  if (!user) return (
    <div className="profile-loading">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="profile-page-wrapper">
      <Navbar />
      
      <div className="container profile-main-container">
        <div className="profile-dashboard-layout">
          
          {/* Sidebar Nav */}
          <aside className="profile-sidebar-aside">
            <div className="user-brief-card">
              <div className="avatar-large">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </div>
              <h2 className="user-name">{user.first_name} {user.last_name}</h2>
              <p className="user-email">{user.email}</p>
              <span className={`role-tag ${user.user_role === 1 ? 'admin' : 'customer'}`}>
                {user.user_role === 1 ? 'Administrator' : 'Premium Customer'}
              </span>
            </div>

            <nav className="profile-nav-menu">
               <button className="nav-item active"><FaUserEdit /> Personal Details</button>
               <button className="nav-item"><FaIdBadge /> My Orders</button>
               <button className="nav-item logout-btn-item" onClick={handleLogout}><FaSignOutAlt /> Sign Out</button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="profile-content-area">
             <div className="profile-card">
                <div className="card-header">
                   <h3>Account Settings</h3>
                   <button className="btn-edit-text">Edit profile</button>
                </div>
                
                <div className="profile-info-grid">
                   <div className="info-box">
                      <label>First Name</label>
                      <p>{user.first_name}</p>
                   </div>
                   <div className="info-box">
                      <label>Last Name</label>
                      <p>{user.last_name}</p>
                   </div>
                   <div className="info-box full">
                      <label>Email Address</label>
                      <p>{user.email}</p>
                   </div>
                   <div className="info-box full">
                      <label>Account Type</label>
                      <p>{user.user_role === 1 ? 'Full Access Administrator' : 'Standard Shopping Account'}</p>
                   </div>
                </div>
             </div>

             <div className="profile-card mini-card">
                <div className="card-header">
                   <h3>Security</h3>
                </div>
                <div className="security-actions">
                    <p>Password last changed 3 months ago</p>
                    <button className="btn-secondary-outline">Change Password</button>
                </div>
             </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;

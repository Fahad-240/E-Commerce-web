import React from "react";
import "./Contact.css";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="contact-page-wrapper">
      <Navbar />
      
      <div className="container contact-main-container">
        <h1 className="contact-main-title">Get in Touch</h1>
        <p className="contact-main-subtitle">Have a question or feedback? We'd love to hear from you.</p>

        <div className="contact-grid-layout">
          {/* Left Column: Info & Map */}
          <div className="contact-info-column">
            <div className="info-card">
              <div className="info-item-box">
                <div className="icon-wrap"><FaPhoneAlt /></div>
                <div className="text-wrap">
                   <h4>Phone</h4>
                   <p>+92 300 1234567</p>
                </div>
              </div>
              <div className="info-item-box">
                <div className="icon-wrap"><FaEnvelope /></div>
                <div className="text-wrap">
                   <h4>Email</h4>
                   <p>support@luxewear.com</p>
                </div>
              </div>
              <div className="info-item-box">
                <div className="icon-wrap"><FaMapMarkerAlt /></div>
                <div className="text-wrap">
                   <h4>Headquarters</h4>
                   <p>DHA Phase 6, Karachi, Pakistan</p>
                </div>
              </div>
            </div>

            <div className="map-card">
               <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.5758063071855!2d67.0681!3d24.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQ4JzAwLjAiTiA2N8KwMDQnMDQuOCJF!5e0!3m2!1sen!2s!4v1692877667269"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="contact-form-column">
             <div className="form-card">
                <h3>Send a Message</h3>
                <form className="contact-premium-form" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
                   <div className="form-group">
                      <label>Your Name</label>
                      <input type="text" placeholder="John Doe" required />
                   </div>
                   <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" placeholder="example@gmail.com" required />
                   </div>
                   <div className="form-group">
                      <label>Subject</label>
                      <input type="text" placeholder="Order Inquiry" required />
                   </div>
                   <div className="form-group">
                      <label>Message</label>
                      <textarea placeholder="How can we help?" rows="5" required></textarea>
                   </div>
                   <button type="submit" className="contact-btn">
                      Send Inquiry <FaPaperPlane />
                   </button>
                </form>
             </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;

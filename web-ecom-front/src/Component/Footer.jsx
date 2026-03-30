import React from "react";
import "./Footer.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGem, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-container">
          
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <Link to="/home" className="footer-logo">
              <FaGem className="brand-logo-icon" />
              <span className="brand-name">LuxeWear</span>
            </Link>
            <p className="brand-desc">
              Experience the pinnacle of boutique fashion. We curate premium products 
              for those who value elegance, comfort, and state-of-the-art style.
            </p>
            <div className="social-links-row">
              <a href="#" className="social-btn"><FaFacebook /></a>
              <a href="#" className="social-btn"><FaTwitter /></a>
              <a href="#" className="social-btn"><FaInstagram /></a>
              <a href="#" className="social-btn"><FaLinkedin /></a>
            </div>
          </div>

          {/* Shop Sections */}
          <div className="footer-section">
            <h4 className="footer-header">Shop Now</h4>
            <ul className="footer-links">
              <li><Link to="/shop">New Arrivals</Link></li>
              <li><Link to="/shop">Best Sellers</Link></li>
              <li><Link to="/shop">Men's Collection</Link></li>
              <li><Link to="/shop">Women's Collection</Link></li>
              <li><Link to="/shop">Accessories</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer-section">
            <h4 className="footer-header">Customer Support</h4>
            <ul className="footer-links">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/about">About LuxeWear</Link></li>
              <li><Link to="/profile">My Account</Link></li>
              <li><Link to="/cart">Track Orders</Link></li>
              <li><Link to="/about">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="footer-section newsletter-section">
            <h4 className="footer-header">Join the Elite</h4>
            <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <div className="input-group-modern">
                <input type="email" placeholder="Email Address" required />
                <button type="submit" className="subscribe-btn">
                  <FaPaperPlane />
                </button>
              </div>
            </form>
            <div className="contact-small-items">
                <div className="icon-item"><FaEnvelope /> support@luxewear.com</div>
                <div className="icon-item"><FaPhoneAlt /> +92 300 1234567</div>
            </div>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-flex">
          <p>© {new Date().getFullYear()} LuxeWear Boutique. All Rights Reserved.</p>
          <div className="payment-methods">
             {/* <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" /> */}
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" />
             {/* <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Google_Pay_%28GPay%29_Logo.svg" alt="GPay" /> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

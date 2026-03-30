import React from "react";
import "./About.css";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import { FaGem, FaShippingFast, FaShieldAlt, FaUndo } from "react-icons/fa";

const About = () => {
  return (
    <div className="about-page-wrapper">
      <Navbar />

      {/* Hero Header */}
      <header className="about-hero-minimal">
        <div className="container">
           <h1 className="hero-title">Our Story <span>&</span> Vision</h1>
           <p className="hero-subtitle">Crafting the future of premium fashion with a focus on quality, sustainability, and timeless design.</p>
        </div>
      </header>

      {/* Main Content Card */}
      <div className="container about-main-container">
        
        {/* Story Section */}
        <section className="about-card-section">
           <div className="about-grid">
              <div className="about-image-box">
                 <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1950" alt="Boutique Interior" />
              </div>
              <div className="about-text-box">
                 <h2 className="section-heading">Redefining Style since 2014</h2>
                 <p>LuxeWear was born from a simple idea: that high-end fashion should be accessible without compromising on the meticulous craftsmanship that defines true luxury.</p>
                 <p>Every piece in our collection is a testament to our commitment to excellence. We work directly with world-class artisans to ensure that every stitch, fabric, and detail meets our rigorous standards. Our journey began in a small studio in Karachi, and today, we are proud to serve a global community of style enthusiasts.</p>
                 
                 <div className="about-metrics">
                    <div className="metric">
                       <span className="number">10+</span>
                       <span className="label">Years of expertise</span>
                    </div>
                    <div className="metric">
                       <span className="number">24/7</span>
                       <span className="label">Customer support</span>
                    </div>
                    <div className="metric">
                       <span className="number">50k+</span>
                       <span className="label">Happy clients</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
           <h2 className="central-heading">What we stand for</h2>
           <div className="values-grid-minimal">
              <div className="value-item">
                 <div className="icon-circle"><FaGem /></div>
                 <h3>Excellence</h3>
                 <p>We source only the finest materials, ensuring every product is built to last and looks impeccable.</p>
              </div>
              <div className="value-item">
                 <div className="icon-circle"><FaShippingFast /></div>
                 <h3>Efficiency</h3>
                 <p>Fast worldwide shipping with reliable delivery partners, ensuring your items reach you on time.</p>
              </div>
              <div className="value-item">
                 <div className="icon-circle"><FaShieldAlt /></div>
                 <h3>Security</h3>
                 <p>Your privacy is our priority. We use the most advanced encryption for every transaction.</p>
              </div>
           </div>
        </section>

      </div>

      <Footer />
    </div>
  );
};

export default About;

import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { GlobalContext } from "../Context/Context";
import api from "../Component/api";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import ProductCard from "../Component/ProductCard";
import PriceFilter from "./PriceFilter";
import { FaSearch, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

const Home = () => {
  const { state } = useContext(GlobalContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [onlySale, setOnlySale] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2070",
      title: "Discover Your <span class='hero-highlight'>Perfect Style</span>",
      subtitle: "Explore the latest fashion trends & upgrade your wardrobe with premium quality products at unbeatable prices.",
      badge: "New Season Collection"
    },
    {
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070",
      title: "Elevate Your <span class='hero-highlight'>Everyday Look</span>",
      subtitle: "Step into the new season with our exclusive handpicked styles designed for ultimate comfort and elegance.",
      badge: " Premium Selection"
    },
    {
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=2070",
      title: "Unbeatable <span class='hero-highlight'>Summer Deals</span>",
      subtitle: "Get up to 50% off on selected items. Shop the latest drop now before it's gone.",
      badge: " Limited Time Offer"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/products", { withCredentials: true }),
          api.get("/categories")
        ]);
        setProducts(prodRes.data.products);
        setFilteredProducts(prodRes.data.products);
        setCategories(catRes.data.category_list || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch home data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = products;
    if (searchTerm) {
      result = result.filter((p) =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (onlySale) {
      result = result.filter((p) => p.is_sale);
    }
    setFilteredProducts(result);
  }, [searchTerm, products, onlySale]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/product/${id}`, { withCredentials: true });
      setProducts(products.filter((p) => p.product_id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await api.post("/cart", { product_id: product.product_id, quantity: 1 }, { withCredentials: true });
      toast.success(`${product.product_name} added to cart`);
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const getCategoryIcon = (name) => {
    const icons = {
      "Electronics": "https://cdn-icons-png.flaticon.com/512/3659/3659899.png",
      "Fashion": "https://cdn-icons-png.flaticon.com/512/3050/3050239.png",
      "Luxury": "https://cdn-icons-png.flaticon.com/512/2554/2554930.png",
      "Home Decor": "https://cdn-icons-png.flaticon.com/512/2590/2590516.png",
      "Health & Beauty": "https://cdn-icons-png.flaticon.com/512/1940/1940922.png",
      "Groceries": "https://cdn-icons-png.flaticon.com/512/3081/3081840.png",
      "Sneakers": "https://cdn-icons-png.flaticon.com/512/2742/2742674.png",
    };
    return icons[name] || "https://cdn-icons-png.flaticon.com/512/751/751463.png";
  };

  return (
    <div className="home-page">
      <Navbar />

      <main className="container">
        {/* ===== SECTION 1: HERO SPLIT ===== */}
        <section className="hero-split">
          <div className="hero-main">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`hero-slide ${index === currentSlide ? "active" : ""}`}
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${slide.image})` }}
              >
                <div className="hero-content">
                  <span className="hero-badge">{slide.badge}</span>
                  <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: slide.title }}></h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <Link to="/shop" className="btn-shop-now">Shop Now</Link>
                </div>
              </div>
            ))}
            <div className="slider-dots">
              {slides.map((_, i) => (
                <span key={i} className={`dot ${i === currentSlide ? "active" : ""}`} onClick={() => setCurrentSlide(i)}></span>
              ))}
            </div>
          </div>
          <div className="hero-side">
            <div className="side-banner-content">
              <span>SALE</span>
              <h4>UP TO <br /> 50% OFF</h4>
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600" alt="Sale Banner" />
              <Link to="/shop" className="btn-shop-now small">Explore Now</Link>
            </div>
          </div>
        </section>

        {/* ===== SECTION 2: POPULAR CATEGORIES ===== */}
        <section className="home-section">
          <div className="section-header">
            <h3>Explore Popular Categories</h3>
            <Link to="/shop" className="view-all">View All <FaArrowRight /></Link>
          </div>
          <div className="category-scroll">
            {categories.map((cat, i) => (
              <Link key={i} to="/shop" className="category-item-circle">
                <div className="circle-img">
                  <img src={getCategoryIcon(cat.category_name)} alt={cat.category_name} />
                </div>
                <span>{cat.category_name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== SECTION: FLASH SALE ===== */}
        {products.some(p => p.is_sale) && (
          <section className="home-section flash-sale-section">
            <div className="section-header">
              <div className="sale-title-group">
                <h3>Flash Sale</h3>
                <span className="sale-tag">Limited Time</span>
              </div>
              <Link to="/shop" className="view-all">See All Deals <FaArrowRight /></Link>
            </div>
            <div className="products-grid-modern">
              {products.filter(p => p.is_sale).slice(0, 5).map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  onDelete={handleDelete}
                  onAddToCart={handleAddToCart}
                  isAdmin={state?.user?.user_role === 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* ===== SECTION 3: TODAY'S BEST DEALS ===== */}
        <section className="home-section">
          <div className="section-header">
            <h3>Today's Best Deals For You!</h3>
            <Link to="/shop" className="view-all">View All <FaArrowRight /></Link>
          </div>
          <div className="products-grid-modern">
            {products.filter(p => !p.is_sale).slice(0, 5).map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                onDelete={handleDelete}
                onAddToCart={handleAddToCart}
                isAdmin={state?.user?.user_role === 1}
              />
            ))}
          </div>
        </section>

        {/* ===== SECTION 4: PROMO BANNERS ===== */}
        <section className="promo-grid">
          <div className="promo-banner bg-dark">
            <img src="/images/poster1.png" alt="Poster 1" className="full-poster" />
          </div>
          <div className="promo-banner bg-gold">
            <img src="/images/poster2.png" alt="Poster 2" className="full-poster" />
          </div>
          <div className="promo-banner bg-premium">
            <img src="/images/poster3.png" alt="Poster 3" className="full-poster" />
          </div>
        </section>

        {/* ===== SECTION 5: WINTER WEAR / SEASONAL ===== */}
        <section className="home-section mb-large">
          <div className="section-header">
            <h3>60% Off Or More On Winter Wear</h3>
            <Link to="/shop" className="view-all">View All <FaArrowRight /></Link>
          </div>
          <div className="products-grid-modern">
            {products.filter(p => !p.is_sale).slice(5, 10).map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                onDelete={handleDelete}
                onAddToCart={handleAddToCart}
                isAdmin={state?.user?.user_role === 1}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <ToastContainer position="bottom-right" autoClose={2500} theme="light" />
    </div>
  );
};

export default Home;

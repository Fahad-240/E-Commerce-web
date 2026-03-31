import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router";
import "./Navbar.css";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaChevronDown, FaPercentage, FaFire, FaGem } from "react-icons/fa";
import { GlobalContext } from "../Context/Context";
import api from "./api";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  let { state, dispatch } = useContext(GlobalContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [pagesOpen, setPagesOpen] = useState(false);

  const [catMenuOpen, setCatMenuOpen] = useState(false);

  const fetchCartCount = async () => {
    if (!state.isLogin) return;
    try {
      const res = await api.get("/cart", { withCredentials: true });
      const totalCount = res.data.cart.reduce((total, item) => total + item.quantity, 0);
      dispatch({ type: "SET_CART_COUNT", payload: totalCount });
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCartCount();
    fetchCategories();
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [state.isLogin]);

  const allPages = [
    { name: "Home", path: "/home" },
    { name: "Shop", path: "/shop" },
    { name: "My Cart", path: "/cart" },
    { name: "My Profile", path: "/profile" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="main-header">
      {/* ===== ROW 1: Logo, Search, and Account ===== */}
      <div className="header-top">
        <div className="container header-top-inner">
          {/* <Link to="/home" className="logo">
            <span className="logo-text">e<span className="max-text">max</span></span>
          </Link> */}
          <Link to="/home" className="nav-logo">
            <FaGem className="brand-logo-icon" />
            <span className="brand-names">LuxeWear</span>
          </Link>

          <div className="header-search">
            <input
              type="text"
              placeholder="Search for any product or brand"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn"><FaSearch /></button>
          </div>

          <div className="header-actions">
            <div className="location-picker">
              <FaMapMarkerAlt className="header-icon" />
              <div className="action-text">
                <span className="label">Deliver to</span>
                <span className="value">Select location</span>
              </div>
            </div>

            <div className="country-picker">
              <img src="https://flagcdn.com/w20/pk.png" alt="UAE Flag" className="flag-icon" />
              {/* <FaChevronDown className="small-icon" /> */}
            </div>

            <div className="nav-action-item" onClick={() => setCartOpen(true)}>
              <div className="cart-wrapper">
                <FaShoppingCart className="header-icon" />
                {state?.isLogin && state.cartCount > 0 && (
                  <span className="cart-badge">{state.cartCount}</span>
                )}
              </div>
              <span className="nav-action-label">Cart</span>
            </div>

            <Link to="/profile" className="nav-action-item">
              <FaUserCircle className="header-icon" />
              <span className="nav-action-label">Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== ROW 2: Categories and Links ===== */}
      <nav className="header-bottom">
        <div className="container header-bottom-inner">
          <div className="all-categories-dropdown">
            <div className="all-categories-btn" onClick={() => setCatMenuOpen(!catMenuOpen)}>
              <FaBars />
              <span>All Categories</span>
              <FaChevronDown className={`small-icon ${catMenuOpen ? 'open' : ''}`} />
            </div>
            {catMenuOpen && (
              <div className="cat-menu">
                {categories.map((cat) => (
                  <Link
                    key={cat.category_id}
                    to="/shop"
                    state={{ category: cat.category_name }}
                    onClick={() => setCatMenuOpen(false)}
                  >
                    {cat.category_name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile sidebar overlay */}
          {menuOpen && <div className="sidebar-overlay active" onClick={() => setMenuOpen(false)}></div>}

          <div className={`nav-links ${menuOpen ? "active" : ""}`}>
            {/* Show all pages in mobile sidebar */}
            {allPages.map((page, index) => (
              <Link key={`page-${index}`} to={page.path} onClick={() => setMenuOpen(false)}>
                {page.name}
              </Link>
            ))}
            {state?.user?.user_role == 1 && (
              <>
                <Link to="/add-product" onClick={() => setMenuOpen(false)}>Add Product</Link>
                <Link to="/category" onClick={() => setMenuOpen(false)}>Manage Categories</Link>
              </>
            )}
            {/* Show categories on desktop */}
            {categories.slice(0, 5).map((cat) => (
              <Link key={cat.category_id} to="/shop" state={{ category: cat.category_name }} onClick={() => setMenuOpen(false)} className="category-link-desktop">
                {cat.category_name}
              </Link>
            ))}
          </div>

          <div className="nav-pages-dropdown">
            <button className="pages-btn" onClick={() => setPagesOpen(!pagesOpen)}>
              <FaBars className="pages-icon" />
              <span>All Pages</span>
              <FaChevronDown className={`chevron ${pagesOpen ? 'open' : ''}`} />
            </button>
            {pagesOpen && (
              <div className="pages-menu">
                {allPages.map((page, index) => (
                  <Link key={index} to={page.path} onClick={() => setPagesOpen(false)}>
                    {page.name}
                  </Link>
                ))}
                {state?.user?.user_role == 1 && (
                  <>
                    <div className="menu-divider"></div>
                    <Link to="/add-product" onClick={() => setPagesOpen(false)}>Add Product</Link>
                    <Link to="/category" onClick={() => setPagesOpen(false)}>Manage Categories</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="quick-deals">
            <Link to="/shop" className="deal-link"><FaPercentage /> Best Deals</Link>
            <Link to="/shop" className="deal-link flash-sale"><FaFire /> Flash Sale</Link>
          </div>

          <div className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
};

export default Navbar;

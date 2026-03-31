import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { GlobalContext } from "../Context/Context";
import api from "../Component/api";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import ProductCard from "../Component/ProductCard";
import { FaSearch, FaFilter, FaTimes, FaChevronDown, FaStar, FaTh, FaBars } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Shop.css";

const Shop = () => {
    const { state } = useContext(GlobalContext);
    const location = useLocation();
    
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Filters State
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [onlySale, setOnlySale] = useState(false);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCondition, setSelectedCondition] = useState("Any");
    const [selectedRatings, setSelectedRatings] = useState([]); // Array of rating numbers
    const [sortOption, setSortOption] = useState("Featured");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [openSections, setOpenSections] = useState({
        categories: true,
        brands: true,
        price: true,
        condition: true,
        ratings: true
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const availableBrands = [...new Set(products.map(p => p.brand_name || "Other"))].filter(Boolean);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    api.get("/products", { withCredentials: true }),
                    api.get("/categories")
                ]);
                setProducts(prodRes.data.products);
                setCategories(catRes.data.data || []);
                
                // Set initial category from location state (from Navbar)
                if (location.state?.category) {
                   setSelectedCategory(location.state.category);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to fetch shop data");
            }
        };
        fetchData();
    }, [location.state]);

    useEffect(() => {
        let result = [...products];

        // Search Filter
        if (searchTerm) {
            result = result.filter((p) =>
                p.product_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category Filter
        if (selectedCategory !== "All") {
            result = result.filter((p) => (p.category_name || "Others") === selectedCategory);
        }

        // Sale Filter
        if (onlySale) {
            result = result.filter((p) => p.is_sale);
        }

        // Verified Filter
        if (verifiedOnly) {
            result = result.filter((p) => p.is_verified);
        }

        // Price Filter
        result = result.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);

        // Brands Filter
        if (selectedBrands.length > 0) {
            result = result.filter((p) => selectedBrands.includes(p.brand_name || "Other"));
        }

        // Condition Filter
        if (selectedCondition !== "Any") {
            result = result.filter((p) => p.condition === selectedCondition);
        }

        // Ratings Filter
        if (selectedRatings.length > 0) {
            result = result.filter((p) => selectedRatings.includes(Math.floor(p.avg_rating || 0)));
        }

        // Sort Logic
        if (sortOption === "Newest") {
            result.sort((a, b) => b.product_id - a.product_id);
        } else if (sortOption === "Price: Low to High") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === "Price: High to Low") {
            result.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(result);
    }, [searchTerm, selectedCategory, onlySale, verifiedOnly, priceRange, selectedBrands, selectedCondition, selectedRatings, sortOption, products]);

    const handleAddToCart = async (product) => {
        try {
            await api.post(
                "/cart",
                { product_id: product.product_id, quantity: 1 },
                { withCredentials: true }
            );
            toast.success(`${product.product_name} added to cart`);
            window.dispatchEvent(new CustomEvent("cartUpdated"));
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add to cart");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/product/${id}`, { withCredentials: true });
            setProducts(products.filter((p) => p.product_id !== id));
            toast.success("Product deleted successfully");
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };

    const toggleBrand = (brand) => {
        setSelectedBrands(prev => 
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const toggleRating = (rating) => {
        setSelectedRatings(prev => 
            prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
        );
    };

    return (
        <div className="shop-page">
            <Navbar />

            <div className="breadcrumb-container">
               <div className="container">
                  <div className="breadcrumbs">
                     <Link to="/home">Home</Link>
                     <span className="separator">/</span>
                     <span className="current">Shop</span>
                     {selectedCategory !== "All" && (
                         <>
                            <span className="separator">/</span>
                            <span className="current">{selectedCategory}</span>
                         </>
                     )}
                  </div>
               </div>
            </div>

            <div className="container shop-layout">
                {/* Sidebar Filter */}
                <aside className={`shop-sidebar ${isSidebarOpen ? "open" : ""}`}>
                    <div className="sidebar-group">
                        <h4 className="sidebar-title" onClick={() => toggleSection('categories')}>
                           Related Category <FaChevronDown className={`small ${openSections.categories ? '' : 'collapsed'}`} />
                        </h4>
                        {openSections.categories && (
                            <ul className="sidebar-list">
                                <li className={selectedCategory === "All" ? "active" : ""} onClick={() => setSelectedCategory("All")}>All items</li>
                                {categories.map(cat => (
                                    <li key={cat.category_id} className={selectedCategory === cat.category_name ? "active" : ""} onClick={() => setSelectedCategory(cat.category_name)}>
                                        {cat.category_name}
                                    </li>
                                ))}
                                <li className="see-more">See more</li>
                            </ul>
                        )}
                    </div>

                    <div className="sidebar-group">
                        <h4 className="sidebar-title" onClick={() => toggleSection('brands')}>
                           Brands <FaChevronDown className={`small ${openSections.brands ? '' : 'collapsed'}`} />
                        </h4>
                        {openSections.brands && (
                            <div className="sidebar-list">
                                {availableBrands.length > 0 ? availableBrands.map(brand => (
                                    <label key={brand} className="checkbox-item">
                                        <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} />
                                        <span>{brand}</span>
                                    </label>
                                )) : <p className="small-text">No brands found</p>}
                            </div>
                        )}
                    </div>

                    <div className="sidebar-group">
                        <h4 className="sidebar-title" onClick={() => toggleSection('price')}>
                           Price range <FaChevronDown className={`small ${openSections.price ? '' : 'collapsed'}`} />
                        </h4>
                        {openSections.price && (
                            <div className="price-range-filter">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="10000" 
                                    value={priceRange.max} 
                                    onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                                    className="range-slider"
                                />
                                <div className="price-inputs">
                                    <div className="input-box">
                                        <label>Min</label>
                                        <input type="number" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} />
                                    </div>
                                    <div className="input-box">
                                        <label>Max</label>
                                        <input type="number" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} />
                                    </div>
                                </div>
                                <button className="apply-btn" onClick={() => setPriceRange({min: 0, max: 10000})}>Reset Price</button>
                            </div>
                        )}
                    </div>

                    <div className="sidebar-group">
                        <h4 className="sidebar-title" onClick={() => toggleSection('condition')}>
                           Condition <FaChevronDown className={`small ${openSections.condition ? '' : 'collapsed'}`} />
                        </h4>
                        {openSections.condition && (
                            <div className="sidebar-list">
                                {["Any", "Refurbished", "Brand New", "Old items"].map(cond => (
                                    <label key={cond} className="radio-item">
                                        <input type="radio" name="condition" checked={selectedCondition === cond} onChange={() => setSelectedCondition(cond)} />
                                        <span>{cond}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="sidebar-group">
                        <h4 className="sidebar-title" onClick={() => toggleSection('ratings')}>
                           Ratings <FaChevronDown className={`small ${openSections.ratings ? '' : 'collapsed'}`} />
                        </h4>
                        {openSections.ratings && (
                            <div className="sidebar-list">
                                {[5, 4, 3, 2].map(rating => (
                                    <label key={rating} className="rating-filter-item">
                                        <input type="checkbox" checked={selectedRatings.includes(rating)} onChange={() => toggleRating(rating)} />
                                        <div className="stars-wrapper">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={i < rating ? "star-filled" : "star-empty"} />
                                            ))}
                                        </div>
                                        <span className="rating-count">& up</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="shop-content">
                    <div className="shop-toolbar">
                        <div className="toolbar-left">
                            <span className="results-count">{filteredProducts.length} items in <strong>{selectedCategory}</strong></span>
                        </div>
                        <div className="toolbar-right">
                           <label className="checkbox-item">
                               <input type="checkbox" checked={verifiedOnly} onChange={() => setVerifiedOnly(!verifiedOnly)} />
                               <span>Verified only</span>
                           </label>
                           <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                               <option>Featured</option>
                               <option>Newest</option>
                               <option>Price: Low to High</option>
                               <option>Price: High to Low</option>
                           </select>
                           <div className="view-mode">
                               <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><FaTh /></button>
                               <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><FaBars /></button>
                           </div>
                        </div>
                    </div>

                    <div className="active-filters">
                        {/* Tags for active filters could go here */}
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="empty-state">
                           <p>No products found matching your criteria.</p>
                           <button onClick={() => {
                               setSelectedCategory("All");
                               setSearchTerm("");
                               setPriceRange({ min: 0, max: 10000 });
                               setSelectedBrands([]);
                               setSelectedCondition("Any");
                               setSelectedRatings([]);
                               setVerifiedOnly(false);
                               setOnlySale(false);
                           }} className="reset-btn">Reset all filters</button>
                        </div>
                    ) : (
                        <div className={`product-display ${viewMode === 'grid' ? 'product-grid' : 'product-list'}`}>
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.product_id}
                                    product={product}
                                    onDelete={handleDelete}
                                    onAddToCart={handleAddToCart}
                                    isAdmin={state?.user?.user_role === 1}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <Footer />
            <ToastContainer position="bottom-right" autoClose={2000} />
        </div>
    );
};

export default Shop;

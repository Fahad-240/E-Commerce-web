import React, { useContext, useEffect } from 'react';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import { Navigate, Route, Routes } from 'react-router';
import Category from './Pages/Category';
import AddProduct from './Pages/Add-product';
import Home from './Pages/Home';
import Cart from './Pages/Cart';
import ProductDetail from './Pages/ProductDetail';
import { GlobalContext } from './Context/Context';
import './App.css';
// import Profile from './Pages/profile';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Checkout from './Pages/Checkout';
import api from './Component/api';   // ✅ import api
import Profile from './Pages/Profile';
import Shop from './Pages/Shop';


const App = () => {
  const { state, dispatch } = useContext(GlobalContext);  // ✅ dispatch bhi lo

  useEffect(() => {
    const getUserData = async () => {
      try {
        let res = await api.get('/profile', { withCredentials: true }); // ✅ cookie ke sath
        dispatch({ type: "USER_LOGIN", user: res.data?.user });
      } catch (error) {
        dispatch({ type: "USER_LOGOUT" });
      }
    }
    getUserData();
  }, [dispatch]);

  if (state.isLogin === null) {
    return (
      <div className="app-loading-container">
        <div className="loading-spinner"></div>
        <p>loading .....</p>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        {/* ===== Public Routes (Anyone can see) ===== */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ===== Protected Routes (Login required) ===== */}
        <Route 
          path="/cart" 
          element={state.isLogin ? <Cart /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={state.isLogin ? <Profile /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/checkout" 
          element={state.isLogin ? <Checkout /> : <Navigate to="/login" />} 
        />
        
        {/* ===== Admin Routes (Role 1 required) ===== */}
        <Route 
          path="/add-product" 
          element={state.isLogin && state.user?.user_role == 1 ? <AddProduct /> : <Navigate to="/home" />} 
        />
        <Route 
          path="/category" 
          element={state.isLogin && state.user?.user_role == 1 ? <Category /> : <Navigate to="/home" />} 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
};

export default App;

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

  return (
    <div>
      {
        state.isLogin === true ? (
          <Routes>
            <Route path="/category" element={<Category />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/home" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="*" element={<Navigate to="/home" />} />


          </Routes>
        ) : state.isLogin === false ? (
          <Routes>
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        ) : (
          <p>loading .....</p>
        )
      }
    </div>
  );
};

export default App;

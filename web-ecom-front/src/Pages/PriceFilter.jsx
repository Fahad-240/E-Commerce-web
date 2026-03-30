import React, { useState, useEffect } from "react";

import { FaSortAmountDown } from "react-icons/fa";

const PriceFilter = ({ products, setFilteredProducts }) => {
  const [sortOption, setSortOption] = useState("");

  // Apply sorting/filter whenever sortOption or products change
  useEffect(() => {
    let updatedProducts = [...products];

    if (sortOption === "lowToHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "under10") {
      updatedProducts = updatedProducts.filter((p) => p.price < 10);
    }
    else if (sortOption === "under20") {
      updatedProducts = updatedProducts.filter((p) => p.price < 20);
    }
    else if (sortOption === "under30") {
      updatedProducts = updatedProducts.filter((p) => p.price < 30);
    }

    setFilteredProducts(updatedProducts);
  }, [sortOption, products, setFilteredProducts]);

  return (
    <div className="premium-filter">
      <FaSortAmountDown className="filter-icon" />
      <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
        <option value="">Sort & Filter</option>
        <option value="lowToHigh">Price: Low to High</option>
        <option value="highToLow">Price: High to Low</option>
        <option value="under50">Under $50</option>
        <option value="under100">Under $100</option>
        <option value="under500">Under $500</option>
      </select>
    </div>
  );
};

export default PriceFilter;

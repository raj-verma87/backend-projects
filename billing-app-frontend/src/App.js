import React, { useState, useEffect } from 'react';
import { fetchProducts } from './services/api';
import ProductList from './components/Product/ProductList';
import AddProduct from './components/Product/AddProduct';
import GenerateBill from './components/Bill/GenerateBill';
import BillHistory from './components/Bill/BillHistory';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const App = () => {
  const [products, setProducts] = useState([]);

  // Fetch products initially
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    loadProducts();
   // console.log("products...",products);
  }, []);
  useEffect(() => {
    console.log("Products updated:", products);
  }, [products]);
  

  return (
    <Router>
      <div  style={{ margin: '10px', padding: '1px' }}>
        <h1>Billing Application</h1>

        {/* Navigation Links */}
        <nav>
          <button>
            <Link to="/">Home</Link>
          </button>
          <button>
            <Link to="/generate-bill">Generate Bill</Link>
          </button>
          <button>
            <Link to="/bill-history">Bill History</Link>
          </button>
        </nav>

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <div>
              <AddProduct setProducts={setProducts} />
              <ProductList products={products} setProducts={setProducts} />
              </div>
            }
          />
          <Route path="/generate-bill" element={<GenerateBill />} />
          <Route path="/bill-history" element={<BillHistory />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

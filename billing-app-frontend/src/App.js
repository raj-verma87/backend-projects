import React, { useState, useEffect } from 'react';
import { fetchProducts,fetchBills, fetchBillById } from './services/api';
import ProductList from './components/Product/ProductList';
import AddProduct from './components/Product/AddProduct';
import GenerateBill from './components/Bill/GenerateBill';
import BillHistory from './components/Bill/BillHistory';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ShowCurrentBill from './components/Bill/ShowCurrentBill';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [bill, setBill] = useState(null); // State to hold the bill data

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

  // Fetch bill data when the user navigates to "/show-bill"
  const location = useLocation(); // Get the current location (pathname)

  // Fetch bill data when the user navigates to "/show-bill"
  useEffect(() => {

    const fetchBill = async () => {
      try {
        const response = await fetchBills();
        // Log the data directly
        const alldata = response.data;

        if (alldata && alldata.length > 0) {
          const { data } = await fetchBillById(alldata[0].id);
          setBill(data);
        } else {
          console.log("No bills found");
        }
      } catch (err) {
        console.error('Error fetching bill:', err);
      }
    };

    if (location.pathname === '/show-bill') {
      fetchBill();
    }
  }, [location.pathname]); // Fetch bill when the route changes

  useEffect(() => {
    console.log("Products updated:", products);
  }, [products]);
  

  return (
   // <Router>
      <div  style={{ marginLeft: '40px', padding: '1px' }}>
        <h1>Billing Application</h1>

        {/* Navigation Links */}
        <nav style={{padding: '1px' }}>
          <button className="button-style">
            <Link to="/">Home</Link>
          </button>
          <button className="button-style">
            <Link to="/generate-bill">Generate Bill</Link>
          </button>
          <button className="button-style">
            <Link to="/bill-history">Bill History</Link>
          </button>
          <button className="button-style">
            <Link to="/show-bill">Show Current Bill</Link>
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
          <Route path="/show-bill" element={<ShowCurrentBill bill={bill} />} />
        </Routes>
      </div>
    //</Router>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;

import axios from 'axios';

// Set the base URL for the backend API
const API = axios.create({
  baseURL: 'http://localhost:3000/api', // Update the port if necessary
});

// Fetch products
export const fetchProducts = () => API.get('/products');

// Add a new product
export const addProduct = (productData) => API.post('/products', productData);

// Generate a bill
export const generateBill = (billData) => API.post('/bills', billData);

// Fetch bill history
export const fetchBills = () => API.get('/bills');

export default API;

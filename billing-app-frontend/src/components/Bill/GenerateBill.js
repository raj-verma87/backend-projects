import React, { useState, useEffect } from 'react';
import { fetchProducts, generateBill } from '../../services/api';

const GenerateBill = () => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [billResponse, setBillResponse] = useState(null);

  // Fetch the products when the component loads
  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    getProducts();
  }, []);

  // Handle product selection and quantity input
  const handleQuantityChange = (productId, quantity) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
      } else {
        return [...prevItems, { productId, quantity }];
      }
    });
  };

  // Submit the bill data to the backend
  const handleGenerateBill = async () => {
    try {
      const { data } = await generateBill({ items: selectedItems });
      console.log("data",data);
      setBillResponse(data);
      alert('Bill generated successfully!');
    } catch (err) {
      console.error('Error generating bill:', err);
      alert('Failed to generate bill');
    }
  };

  return (
    <div>
      <h2>Generate Bill</h2>
      <div>
        {products.map((product) => (
          <div key={product.id}  style={{ margin: '10px', padding: '1px' }}>
            <span>
              {product.name} (₹{product.price})
            </span>
            <input
              type="number"
              placeholder="Quantity"
              onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
            />
          </div>
        ))}
      </div>
      <button onClick={handleGenerateBill}>Generate Bill</button>

      {billResponse && (
        <div>
          <h2>Bill Summary</h2>
          <p><strong>Bill ID:</strong> {billResponse.id}</p>
          <ul>
            {billResponse.billItems?.map((item) => (
              <li key={item.id}>
                {item.product.name} - ₹{item.product.price} x {item.quantity}
              </li>
            ))}
          </ul>
          <p><strong>Total Amount:</strong> ₹{billResponse.totalAmount}</p>
        </div>
      )}
    </div>
  );
};

export default GenerateBill;

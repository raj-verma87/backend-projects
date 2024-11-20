import React from 'react';
import ProductList from './components/Product/ProductList';
import AddProduct from './components/Product/AddProduct';
import GenerateBill from './components/Bill/GenerateBill';

const App = () => {
  return (
    <div>
      <h1>Billing Application</h1>
      <AddProduct />
      <ProductList />
      <GenerateBill />
    </div>
  );
};

export default App;

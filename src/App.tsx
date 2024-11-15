import React from 'react';
import logo from './logo.svg';
import './App.css';
import AdminProductForm from './components/product-input';
import ProductList from './components/product-view';

function App() {
  return (
    <div className="App">
      <AdminProductForm/>
      <ProductList/>
    </div>
  );
}

export default App;

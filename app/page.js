"use client"
import Navbar from "@/components/Navbar";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({
    stockName: '',
    stockQuantity: '',
    stockPrice: ''
  });
  const [searchText, setsearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [alert, setalert] = useState("");
  const [loading, setloading] = useState(false);
  const [dropdown, setdropdown] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  // Fetch all products initially
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/product');
      if (response.ok) {
        const rjson = await response.json();
        setProducts(rjson.products || []);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add a new product
  const addProduct = async () => {
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });
      if (response.ok) {
        const newProduct = await response.json();
        setalert(<b>Your Product has been added! Refresh to see the Results</b>);
        setProductForm({ stockName: '', stockQuantity: '', stockPrice: '' });
        updateProductsList(newProduct);
      } else {
        console.log('Error adding product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Update the products list with the new product
  const updateProductsList = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  // Handle input changes for the product form
  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  // Fetch filtered products based on the search text
  const fetchFilteredProducts = async (searchText) => {
    try {
      const response = await fetch(`/api/product?searchText=${searchText}`);
      if (response.ok) {
        const rjson = await response.json();
        setdropdown(rjson.products);
      } else {
        console.error('Failed to fetch filtered products');
      }
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    } finally {
      setloading(false);
    }
  };

  // Handle search input changes
  const onDropdown = (e) => {
    const searchText = e.target.value;
    setsearchText(searchText);
    setloading(true);
    fetchFilteredProducts(searchText);
  };

  // Refs for products
  const productRefs = useRef({});

  // Scroll to product
  const scrollToProduct = (id) => {
    productRefs.current[id]?.scrollIntoView({ behavior: 'smooth' });
  };

  // Edit a product
  const editProduct = (product) => {
    setProductForm({
      stockName: product.stockName,
      stockQuantity: product.stockQuantity,
      stockPrice: product.stockPrice
    });
    setIsEditing(true);
    setEditProductId(product._id);
    scrollToProductForm();
  };

  // Scroll to product form
  const scrollToProductForm = () => {
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
  };

  // Update the product in the database
  const updateProduct = async () => {
    try {
      const response = await fetch(`/api/product/${editProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        setalert(<b>Your Product has been updated! Refresh to see the Results</b>);
        console.log('Product updated successfully:', updatedProduct);
        setProductForm({ stockName: '', stockQuantity: '', stockPrice: '' });
        setIsEditing(false);
        updateProductsInList(updatedProduct);
      } else {
        console.log('Error updating product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // Update the product in the list
  const updateProductsInList = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setalert(<b>Your Product has been deleted! Refresh to see the Results</b>);
        setProducts(products.filter(product => product._id !== id));
      } else {
        console.log('Error deleting product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateProduct();
    } else {
      addProduct();
    }
  };

  return (
    <>
      <Navbar />
      <div className="container bg-red-50 mx-auto p-4">
        <div className="text-green-800 text-center">{alert}</div>
        <h1 className="text-2xl font-bold mb-4">Search a Product</h1>
        <div className="mb-4">
          <label htmlFor="searchProduct" className="block text-sm font-medium text-gray-700">
            Search 
          </label>
          <div className="relative w-full">
            <input
              onChange={onDropdown}
              type="text"
              id="searchProduct"
              name="searchProduct"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search for a product"
            />
            {loading && (
              <svg
                version="1.1"
                id="L9"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 100 100"
                enableBackground="new 0 0 0 0"
                xmlSpace="preserve"
                style={{ width: '50px', height: '50px', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
              >
                <path
                  fill="#000"
                  d="M73.5,50c0-12.9-10.6-23.5-23.5-23.5S26.5,37.1,26.5,50H17.3c0-18.2,14.8-33,33-33s33,14.8,33,33H73.5z"
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    dur="1s"
                    from="0 50 50"
                    to="360 50 50"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            )}
            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
              {dropdown.map(item => (
                <div 
                  key={item._id} 
                  className="flex justify-between px-4 py-2 cursor-pointer hover:bg-indigo-100 transition-colors"
                  onClick={() => scrollToProduct(item._id)}
                >
                  <span className="stockName text-sm font-medium text-gray-700">{item.stockName}: {item.stockQuantity} available at ${item.stockPrice}</span>
                  <span className="stockQuantity text-sm text-gray-500"></span>
                  <span className="StockPrice text-sm text-gray-500"></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="my-6 border-t-2 border-gray-300" />

        <h1 className="text-2xl font-bold mb-4">Add a Product</h1>
        <div id="productForm" className="mb-4">
          <div className="mb-2">
            <label htmlFor="stockName" className="block text-sm font-medium text-gray-700">
              Stock Name
            </label>
            <input
              onChange={handleChange}
              type="text"
              id="stockName"
              name="stockName"
              value={productForm.stockName}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
              Stock Quantity
            </label>
            <input
              onChange={handleChange}
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={productForm.stockQuantity}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="stockPrice" className="block text-sm font-medium text-gray-700">
              Stock Price
            </label>
            <input
              onChange={handleChange}
              type="number"
              id="stockPrice"
              name="stockPrice"
              value={productForm.stockPrice}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isEditing ? 'Update Product' : 'Add Product'}
          </button>
        </div>

        <hr className="my-6 border-t-2 border-gray-300" />

        <h1 className="text-2xl font-bold mb-4">Product List</h1>
        <div className="overflow-x-auto bg-red-50">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products && products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={index} ref={el => (productRefs.current[product._id] = el)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.stockName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.stockPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stockQuantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.stockPrice * product.stockQuantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900" onClick={() => editProduct(product)}>
                        Edit
                      </a>
                      <a href="#" className="text-red-600 hover:text-red-900 ml-4" onClick={() => deleteProduct(product._id)}>
                        Delete
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  console.log('🔐 Token from localStorage:', localStorage.getItem('token'));

  const fetchItems = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/items', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setItems(res.data.items);
  };
  
  const token = localStorage.getItem('token');
  console.log('Token:', token);
  const addItem = async () => {
    const token = localStorage.getItem('token');
    console.log('Adding item with token:', token); // this should NOT be undefined
  
    try {
      const res = await axios.post('http://localhost:5000/items', {
        name,
        quantity,
        description
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Item added:', res.data);
    } catch (err) {
      console.error('❌ Failed to add item:', err);
    }
  };

  axios.get('http://localhost:5000/items', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then(res => {
    console.log('Items:', res.data.items);
  })
  .catch(err => {
    console.error('Fetch items failed:', err.response?.data || err.message);
  });

  const logout = () => {
    localStorage.removeItem('token');
    alert('👋 Logged out!');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('📦 Dashboard loaded with token:', token);
  
    if (!token) {
      alert('No token found. Redirecting to login.');
      navigate('/login');
    } else {
      fetchItems();
    }
  }, [navigate]);

  return (
    <div>
      <h1>📦 Dashboard</h1>
      <button onClick={logout}>🚪 Logout</button>
      <input placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
      <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <button onClick={addItem}>➕ Add Item</button>

      <ul>
        {items.map((item, i) => (
          <li key={i}>{item.name} - {item.quantity} - {item.description} (By {item.createdBy})</li>
        ))}
      </ul>
    </div>
  );
}
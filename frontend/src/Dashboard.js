import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchItems = async () => {
    const res = await axios.get('http://localhost:5000/items');
    setItems(res.data.items);
  };

  const addItem = async () => {
    await axios.post('http://localhost:5000/items', { token, name, quantity, description });
    fetchItems();
  };

  const logout = () => {
    localStorage.removeItem('token');
    alert('👋 Logged out!');
    navigate('/login');
  };

  useEffect(() => {
    if (!token) navigate('/login');
    fetchItems();
  }, []);

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
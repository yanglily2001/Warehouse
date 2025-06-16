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

   // Helper to grab token
   const getToken = () => localStorage.getItem('token');

   // Fetch on mount
   useEffect(() => {
     (async () => {
       try {
         const res = await axios.get('http://localhost:5000/items', {
           headers: { Authorization: `Bearer ${getToken()}` }
         });
         setItems(res.data.items);
       } catch (err) {
         console.error('Fetch items failed:', err.response?.data || err.message);
         if (err.response?.status === 401) navigate('/login');
       }
     })();
   }, [navigate]);
 
   // Add item
   const addItem = async () => {
     try {
       const res = await axios.post(
         'http://localhost:5000/items',
         { name, quantity, description },
         { headers: { Authorization: `Bearer ${getToken()}` } }
       );
       setItems(prev => [...prev, res.data.item]);
       setName(''); setQuantity(''); setDescription('');
     } catch (err) {
       console.error('❌ Failed to add item:', err.response?.data || err.message);
       setError(err.response?.data?.error || 'Failed to add');
     }
   };
 
   const logout = () => {
     localStorage.removeItem('token');
     navigate('/login');
   };
 
   return (
     <div>
       <h1>📦 Dashboard</h1>
       <button onClick={logout}>🚪 Logout</button>
       {error && <p style={{ color: 'red' }}>{error}</p>}
       <input placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} />
       <input placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
       <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
       <button onClick={addItem}>➕ Add Item</button>
 
       <ul>
         {items.map((item, i) => (
           <li key={i}>
             {item.name} — {item.quantity} — {item.description} (By {item.createdBy})
           </li>
         ))}
       </ul>
     </div>
   );
 }
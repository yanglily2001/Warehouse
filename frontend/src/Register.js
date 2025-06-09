import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    try {
      await axios.post('http://localhost:5000/register', { username, password });
      alert('✅ Registered!');
    } catch (err) {
      alert(`❌ Register failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div>
      <h2>📝 Register</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

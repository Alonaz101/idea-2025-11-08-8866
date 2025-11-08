import React, { useState, useEffect } from 'react';

function App() {
  const [mood, setMood] = useState('');
  const [token, setToken] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  async function login() {
    const response = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginUsername, password: loginPassword })
    });
    const data = await response.json();
    if (data.accessToken) {
      setToken(data.accessToken);
      alert('Login successful');
    } else {
      alert('Login failed');
    }
  }

  async function submitMood() {
    if (!token) return alert('You must login first');
    const response = await fetch('http://localhost:4000/api/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ mood })
    });
    const data = await response.json();
    if (response.ok) {
      alert('Mood submitted');
      fetchRecipes();
    } else {
      alert('Mood submission failed: ' + data.error);
    }
  }

  async function fetchRecipes() {
    if (!token) return;
    const response = await fetch('http://localhost:4000/api/recipes', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      setRecipes(data);
    }
  }

  return (
    <div>
      <h1>Mood-Based Recipe Recommender</h1>

      <div>
        <h2>Login</h2>
        <input placeholder="Username" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
        <button onClick={login}>Login</button>
      </div>

      <div>
        <h2>Enter Your Mood</h2>
        <input value={mood} onChange={e => setMood(e.target.value)} placeholder="e.g. happy, sad" />
        <button onClick={submitMood}>Submit Mood</button>
      </div>

      <div>
        <h2>Recommended Recipes</h2>
        <ul>
          {recipes.map(r => (
            <li key={r.id}>{r.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

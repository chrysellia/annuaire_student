import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/login', { username, password });
      // Adjust the response destructuring to match your API
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-400 to-purple-400">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center">
        {/* <img src="/logo.svg" alt="Annuaire Logo" className="mb-6 w-16 h-16" /> */}
        <h2 className="text-2xl font-bold text-blue-800 mb-2">ANNUAIRE STUDENT</h2>
        <p className="text-gray-500 mb-6">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-blue-900 mb-1">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-blue-900 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {error && <div className="text-red-600 mb-4 text-sm text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

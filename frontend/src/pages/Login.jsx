import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data);

      if (res.data.role === 'Admin') navigate('/admin');
      else if (res.data.role === 'Teacher') navigate('/teacher');
      else if (res.data.role === 'Student') navigate('/student');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-paper text-center mb-1">Young Explorers Academy</h1>
        <p className="text-paper/60 text-center text-sm mb-8">Sign in to your records portal</p>

        <form onSubmit={handleSubmit} className="bg-paper rounded p-8 space-y-4">
          <div>
            <label className="block text-sm mb-1 text-ink/70">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-ink/70">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate"
            />
          </div>

          {error && <p className="text-rust text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-slate hover:bg-slate-dark text-white text-sm font-medium rounded py-2.5 transition-colors"
          >
            Sign in
          </button>

          <p className="text-center text-sm text-ink/60">
            Don't have an account?{' '}
            <Link to="/signup" className="text-slate hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
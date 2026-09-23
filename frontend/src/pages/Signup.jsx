import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'Student', employeeId: '', rollNumber: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/register', form);
      login(res.data);

      if (res.data.role === 'Admin') navigate('/admin');
      else if (res.data.role === 'Teacher') navigate('/teacher');
      else if (res.data.role === 'Student') navigate('/student');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-paper text-center mb-1">Create an account</h1>
        <p className="text-paper/60 text-center text-sm mb-8">Join your school's records portal</p>

        <form onSubmit={handleSubmit} className="bg-paper rounded p-8 space-y-4">
          <div>
            <label className="block text-sm mb-1 text-ink/70">I am a</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-ink/70">Full name</label>
            <input
              name="name" value={form.name} onChange={handleChange} required
              className="w-full border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-ink/70">Email</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-ink/70">Password</label>
            <input
              type="password" name="password" value={form.password} onChange={handleChange} required
              className="w-full border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate"
            />
          </div>

          {form.role === 'Teacher' && (
            <div>
              <label className="block text-sm mb-1 text-ink/70">Employee ID</label>
              <input
                name="employeeId" value={form.employeeId} onChange={handleChange} required
                placeholder="Given to you by your admin"
                className="w-full border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate"
              />
            </div>
          )}

          {form.role === 'Student' && (
            <div>
              <label className="block text-sm mb-1 text-ink/70">Roll number</label>
              <input
                name="rollNumber" value={form.rollNumber} onChange={handleChange} required
                placeholder="Given to you by your admin"
                className="w-full border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate"
              />
            </div>
          )}

          {error && <p className="text-rust text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-slate hover:bg-slate-dark text-white text-sm font-medium rounded py-2.5 transition-colors"
          >
            Create account
          </button>

          <p className="text-center text-sm text-ink/60">
            Already have an account?{' '}
            <Link to="/login" className="text-slate hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
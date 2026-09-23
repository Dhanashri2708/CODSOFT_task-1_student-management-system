import { useState, useEffect } from 'react';
import { getStudents, createStudent, deleteStudent } from '../api/students';
import Layout from '../components/Layout';

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '', rollNumber: '', className: '', section: '',
    gender: '', parentName: '', contactNumber: '',
  });

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await getStudents();
      setStudents(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStudents(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createStudent(form);
      setForm({ name: '', rollNumber: '', className: '', section: '', gender: '', parentName: '', contactNumber: '' });
      setShowForm(false);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add student');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this student from records?')) return;
    try {
      await deleteStudent(id);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete student');
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink">Students</h1>
          <p className="text-ink/50 text-sm mt-1">{students.length} enrolled</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-slate hover:bg-slate-dark text-white text-sm font-medium rounded px-4 py-2 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Student'}
        </button>
      </div>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}

      {showForm && (
        <form onSubmit={handleAddStudent} className="bg-white border border-ink/10 rounded p-6 mb-8 grid grid-cols-2 gap-4">
          <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate col-span-2" />
          <input name="rollNumber" placeholder="Roll number" value={form.rollNumber} onChange={handleChange} required
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate" />
          <input name="className" placeholder="Class (e.g. 10)" value={form.className} onChange={handleChange} required
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate" />
          <input name="section" placeholder="Section" value={form.section} onChange={handleChange}
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate" />
          <select name="gender" value={form.gender} onChange={handleChange}
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate">
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input name="parentName" placeholder="Parent name" value={form.parentName} onChange={handleChange}
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate" />
          <input name="contactNumber" placeholder="Contact number" value={form.contactNumber} onChange={handleChange}
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate" />
          <button type="submit" className="bg-slate hover:bg-slate-dark text-white text-sm font-medium rounded py-2.5 col-span-2 transition-colors">
            Save student
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-ink/50 text-sm">Loading...</p>
      ) : students.length === 0 ? (
        <div className="bg-white border border-ink/10 rounded p-10 text-center">
          <p className="text-ink/50 text-sm">No students enrolled yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="bg-white border border-ink/10 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-ink/50">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Roll no.</th>
                <th className="px-4 py-3 font-medium">Class</th>
                <th className="px-4 py-3 font-medium">Section</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-b border-ink/5 last:border-0 hover:bg-paper/50">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-ink/70">{s.rollNumber}</td>
                  <td className="px-4 py-3 text-ink/70">{s.className}</td>
                  <td className="px-4 py-3 text-ink/70">{s.section}</td>
                  <td className="px-4 py-3 text-ink/70">{s.contactNumber}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(s._id)} className="text-rust text-xs hover:underline">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

export default AdminDashboard;
import { useState, useEffect } from 'react';
import { getTeachers, createTeacher, deleteTeacher } from '../api/teachers';
import Layout from '../components/Layout';

function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '', employeeId: '', subject: '', qualification: '',
    gender: '', email: '', contactNumber: '', classesAssigned: '',
  });

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const res = await getTeachers();
      setTeachers(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTeachers(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        classesAssigned: form.classesAssigned.split(',').map((c) => c.trim()).filter(Boolean),
      };
      await createTeacher(payload);
      setForm({ name: '', employeeId: '', subject: '', qualification: '', gender: '', email: '', contactNumber: '', classesAssigned: '' });
      setShowForm(false);
      loadTeachers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add teacher');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this teacher from records?')) return;
    try {
      await deleteTeacher(id);
      loadTeachers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete teacher');
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink">Teachers</h1>
          <p className="text-ink/50 text-sm mt-1">{teachers.length} on staff</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-slate hover:bg-slate-dark text-white text-sm font-medium rounded px-4 py-2 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Teacher'}
        </button>
      </div>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}

      {showForm && (
        <form onSubmit={handleAddTeacher} className="bg-white border border-ink/10 rounded p-6 mb-8 grid grid-cols-2 gap-4">
          <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate col-span-2" />
          <input name="employeeId" placeholder="Employee ID" value={form.employeeId} onChange={handleChange} required
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate" />
          <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate" />
          <input name="qualification" placeholder="Qualification" value={form.qualification} onChange={handleChange}
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate" />
          <select name="gender" value={form.gender} onChange={handleChange}
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate">
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate" />
          <input name="contactNumber" placeholder="Contact number" value={form.contactNumber} onChange={handleChange}
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate" />
          <input name="classesAssigned" placeholder="Classes (e.g. 10-A, 9-B)" value={form.classesAssigned} onChange={handleChange}
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate" />
          <button type="submit" className="bg-slate hover:bg-slate-dark text-white text-sm font-medium rounded py-2.5 col-span-2 transition-colors">
            Save teacher
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-ink/50 text-sm">Loading...</p>
      ) : teachers.length === 0 ? (
        <div className="bg-white border border-ink/10 rounded p-10 text-center">
          <p className="text-ink/50 text-sm">No teachers added yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-ink/10 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-ink/50">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Employee ID</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Classes</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t._id} className="border-b border-ink/5 last:border-0 hover:bg-paper/50">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-ink/70">{t.employeeId}</td>
                  <td className="px-4 py-3 text-ink/70">{t.subject}</td>
                  <td className="px-4 py-3 text-ink/70">{t.classesAssigned?.join(', ')}</td>
                  <td className="px-4 py-3 text-ink/70">{t.email}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(t._id)} className="text-rust text-xs hover:underline">
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

export default TeacherManagement;
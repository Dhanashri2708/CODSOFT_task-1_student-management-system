import { useState } from 'react';
import { getStudentsByClass } from '../api/students';
import { markBulkAttendance } from '../api/attendance';
import Layout from '../components/Layout';

const STATUS_STYLES = {
  Present: 'bg-sage/10 text-sage border-sage/30',
  Absent: 'bg-rust/10 text-rust border-rust/30',
  Leave: 'bg-gold/10 text-gold border-gold/30',
};

function TeacherDashboard() {
  const [className, setClassName] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoadClass = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!className) return;
    try {
      setLoading(true);
      const res = await getStudentsByClass(className);
      setStudents(res.data);
      const defaults = {};
      res.data.forEach((s) => (defaults[s._id] = 'Present'));
      setAttendance(defaults);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => setAttendance({ ...attendance, [studentId]: status });

  const handleSubmitAttendance = async () => {
    setError(''); setSuccess('');
    try {
      const records = students.map((s) => ({ student: s._id, className, date, status: attendance[s._id] }));
      await markBulkAttendance({ records });
      setSuccess(`Attendance saved for ${records.length} students on ${date}.`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save attendance');
    }
  };

  return (
    <Layout>
      <h1 className="font-serif text-3xl text-ink mb-1">Attendance</h1>
      <p className="text-ink/50 text-sm mb-8">Load a class and mark today's attendance</p>

      <form onSubmit={handleLoadClass} className="bg-white border border-ink/10 rounded p-5 mb-6 flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs text-ink/50 mb-1">Class</label>
          <input
            placeholder="e.g. 10-A"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
            className="w-full border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate"
          />
        </div>
        <div>
          <label className="block text-xs text-ink/50 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="border border-ink/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate"
          />
        </div>
        <button type="submit" className="bg-slate hover:bg-slate-dark text-white text-sm font-medium rounded px-4 py-2 transition-colors">
          Load class
        </button>
      </form>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}
      {success && <p className="text-sage text-sm mb-4">{success}</p>}
      {loading && <p className="text-ink/50 text-sm">Loading...</p>}

      {students.length > 0 && (
        <>
          <div className="bg-white border border-ink/10 rounded overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-ink/50">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Roll no.</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border-b border-ink/5 last:border-0">
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-ink/70">{s.rollNumber}</td>
                    <td className="px-4 py-3">
                      <select
                        value={attendance[s._id]}
                        onChange={(e) => handleStatusChange(s._id, e.target.value)}
                        className={`border rounded px-2 py-1 text-xs font-medium ${STATUS_STYLES[attendance[s._id]]}`}
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Leave">Leave</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleSubmitAttendance} className="bg-slate hover:bg-slate-dark text-white text-sm font-medium rounded px-5 py-2.5 transition-colors">
            Submit attendance
          </button>
        </>
      )}

      {students.length === 0 && !loading && (
        <div className="bg-white border border-ink/10 rounded p-10 text-center">
          <p className="text-ink/50 text-sm">Enter a class above to load its students.</p>
        </div>
      )}
    </Layout>
  );
}

export default TeacherDashboard;
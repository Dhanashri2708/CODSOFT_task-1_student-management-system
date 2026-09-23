import { useState, useEffect } from 'react';
import { getMyAttendance, getMyFees, getMyResults } from '../api/student-self';
import Layout from '../components/Layout';

const FEE_STATUS_STYLES = {
  Paid: 'bg-sage/10 text-sage',
  Partial: 'bg-gold/10 text-gold',
  Pending: 'bg-rust/10 text-rust',
};

function StudentDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [attRes, feeRes, resultRes] = await Promise.all([getMyAttendance(), getMyFees(), getMyResults()]);
        setAttendance(attRes.data);
        setFees(feeRes.data);
        setResults(resultRes.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load your data');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const attendancePercent = attendance.length > 0 ? ((presentCount / attendance.length) * 100).toFixed(1) : 0;

  return (
    <Layout>
      <h1 className="font-serif text-3xl text-ink mb-8">My Records</h1>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}
      {loading && <p className="text-ink/50 text-sm">Loading...</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-white border border-ink/10 rounded p-5">
              <p className="text-xs text-ink/50 mb-1">Attendance</p>
              <p className="font-serif text-2xl text-ink">{attendancePercent}%</p>
            </div>
            <div className="bg-white border border-ink/10 rounded p-5">
              <p className="text-xs text-ink/50 mb-1">Exams recorded</p>
              <p className="font-serif text-2xl text-ink">{results.length}</p>
            </div>
            <div className="bg-white border border-ink/10 rounded p-5">
              <p className="text-xs text-ink/50 mb-1">Fee dues</p>
              <p className="font-serif text-2xl text-ink">{fees.filter((f) => f.status !== 'Paid').length}</p>
            </div>
          </div>

          <h2 className="font-serif text-xl text-ink mb-3">Attendance</h2>
          {attendance.length === 0 ? (
            <p className="text-ink/50 text-sm mb-10">No attendance records yet.</p>
          ) : (
            <div className="bg-white border border-ink/10 rounded overflow-hidden mb-10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-left text-ink/50">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Marked by</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a) => (
                    <tr key={a._id} className="border-b border-ink/5 last:border-0">
                      <td className="px-4 py-3 text-ink/70">{new Date(a.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{a.status}</td>
                      <td className="px-4 py-3 text-ink/70">{a.markedBy?.name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h2 className="font-serif text-xl text-ink mb-3">Fees</h2>
          {fees.length === 0 ? (
            <p className="text-ink/50 text-sm mb-10">No fee records yet.</p>
          ) : (
            <div className="bg-white border border-ink/10 rounded overflow-hidden mb-10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-left text-ink/50">
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Paid</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f) => (
                    <tr key={f._id} className="border-b border-ink/5 last:border-0">
                      <td className="px-4 py-3">{f.feeType}</td>
                      <td className="px-4 py-3 text-ink/70">₹{f.totalAmount}</td>
                      <td className="px-4 py-3 text-ink/70">₹{f.amountPaid}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${FEE_STATUS_STYLES[f.status]}`}>{f.status}</span>
                      </td>
                      <td className="px-4 py-3 text-ink/70">{new Date(f.dueDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h2 className="font-serif text-xl text-ink mb-3">Exam results</h2>
          {results.length === 0 ? (
            <p className="text-ink/50 text-sm">No results yet.</p>
          ) : (
            <div className="bg-white border border-ink/10 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-left text-ink/50">
                    <th className="px-4 py-3 font-medium">Exam</th>
                    <th className="px-4 py-3 font-medium">Subject</th>
                    <th className="px-4 py-3 font-medium">Marks</th>
                    <th className="px-4 py-3 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r._id} className="border-b border-ink/5 last:border-0">
                      <td className="px-4 py-3">{r.exam?.examName}</td>
                      <td className="px-4 py-3 text-ink/70">{r.exam?.subject}</td>
                      <td className="px-4 py-3 text-ink/70">{r.marksObtained} / {r.exam?.maxMarks}</td>
                      <td className="px-4 py-3 font-medium text-gold">{r.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}

export default StudentDashboard;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import TeacherManagement from './pages/TeacherManagement';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/teachers"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <TeacherManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['Teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
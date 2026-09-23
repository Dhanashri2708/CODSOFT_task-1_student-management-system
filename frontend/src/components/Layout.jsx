import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = {
  Admin: [
    { to: '/admin', label: 'Students' },
    { to: '/admin/teachers', label: 'Teachers' },
  ],
  Teacher: [
    { to: '/teacher', label: 'Attendance' },
  ],
  Student: [
    { to: '/student', label: 'My Records' },
  ],
};

function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navItems = NAV_ITEMS[user?.role] || [];

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="w-60 shrink-0 bg-ink text-paper flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="font-serif text-lg leading-tight">Young Explorers Academy<br />School Records</h1>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-3 py-2 rounded text-sm transition-colors ${
                location.pathname === item.to
                  ? 'bg-slate text-white'
                  : 'text-paper/80 hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-paper/60 mb-1">Signed in as</p>
          <p className="text-sm mb-3">{user?.name}</p>
          <button
            onClick={logout}
            className="text-sm text-paper/80 hover:text-white underline underline-offset-2"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-10 py-8 max-w-5xl">
        {children}
      </main>
    </div>
  );
}

export default Layout;
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="font-serif text-4xl text-paper mb-2">Young Explorers Academy</h1>
        <p className="text-paper/60 text-sm mb-10">Records portal for students, teachers and administrators</p>

        <div className="bg-paper rounded p-8 space-y-3">
          <Link
            to="/login"
            className="block w-full bg-slate hover:bg-slate-dark text-white text-sm font-medium rounded py-2.5 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="block w-full border border-ink/20 hover:bg-ink/5 text-ink text-sm font-medium rounded py-2.5 transition-colors"
          >
            Create an account
          </Link>
        </div>

        <p className="text-paper/40 text-xs mt-6">Students and teachers: your admin must add your record before you can sign up.</p>
      </div>
    </div>
  );
}

export default Home;
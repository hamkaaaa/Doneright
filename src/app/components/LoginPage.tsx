import { useState } from 'react';
import { User } from '../App';

type LoginPageProps = {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
};

export default function LoginPage({ onLogin, onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi input sisi klien
    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    if (!email.includes('@')) {
      setError('Format email tidak valid');
      return;
    }

    setLoading(true);

    // Simulasi login (dalam implementasi nyata, ini akan memanggil API backend)
    setTimeout(() => {
      // Mock data - admin login
      if (email === 'admin@doneright.com' && password === 'admin123') {
        onLogin({
          user_id: 'admin-001',
          full_name: 'Admin DoneRight',
          email: 'admin@doneright.com',
          role: 'admin'
        });
      }
      // Mock data - mahasiswa login
      else if (email === 'mahasiswa@undip.ac.id' && password === 'mahasiswa123') {
        onLogin({
          user_id: 'user-001',
          full_name: 'Lanjar Setiawan',
          email: 'mahasiswa@undip.ac.id',
          role: 'mahasiswa'
        });
      } else {
        setError('Email atau password salah');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo dan Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">DoneRight</h1>
          <p className="text-gray-600 mt-2">Sistem Manajemen Tugas Mahasiswa</p>
        </div>

        {/* Form Login */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-indigo-600 font-medium hover:text-indigo-700"
              >
                Daftar di sini
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Mahasiswa:</strong></p>
              <p>Email: mahasiswa@undip.ac.id</p>
              <p>Password: mahasiswa123</p>
              <p className="mt-2"><strong>Admin:</strong></p>
              <p>Email: admin@doneright.com</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

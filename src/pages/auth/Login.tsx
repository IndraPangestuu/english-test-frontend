import { useState } from 'react';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { useAuthStore } from '../../store/useAuthStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, setProfile } = useAuthStore();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { user, profile, error } = await login(email, password);
    setLoading(false);

    if (error) {
      setError(error.message || 'Login gagal');
      return;
    }

    setUser(user);
    setProfile(profile);

    if (profile.role === 'admin') navigate('/admin/dashboard');
    else if (profile.role === 'tutor') navigate('/tutor/dashboard');
    else navigate('/student/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold">Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? <Loader /> : 'Login'}
        </button>

        <p
          className="text-sm text-blue-500 cursor-pointer"
          onClick={() => navigate('/forgot-password')}
        >
          Lupa password?
        </p>
      </form>
    </div>
  );
}

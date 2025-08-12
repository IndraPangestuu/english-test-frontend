import { useState } from 'react';
import { register } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await register(email, password, {
      full_name: fullName,
      role,
    });

    setLoading(false);

    if (error) {
      setError(error.message || 'Registrasi gagal');
      return;
    }

    alert('Registrasi berhasil! Silakan login.');
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold">Register</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border px-3 py-2 rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <select
          className="w-full border px-3 py-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value as 'student' | 'tutor')}
        >
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
        </select>

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
          className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? <Loader /> : 'Register'}
        </button>

        <p
          className="text-sm text-blue-500 cursor-pointer"
          onClick={() => navigate('/login')}
        >
          Sudah punya akun? Login
        </p>
      </form>
    </div>
  );
}

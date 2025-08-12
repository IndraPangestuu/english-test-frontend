import { useState } from 'react';
import { resetPassword } from '../../api/auth';
import Loader from '../../components/Loader';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      setError(error.message || 'Gagal mengirim email reset password');
      return;
    }

    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-6 rounded shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold">Reset Password</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {sent && <p className="text-green-500 text-sm">Email reset terkirim!</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-yellow-500 text-white w-full py-2 rounded hover:bg-yellow-600"
          disabled={loading}
        >
          {loading ? <Loader /> : 'Kirim Link Reset'}
        </button>
      </form>
    </div>
  );
}

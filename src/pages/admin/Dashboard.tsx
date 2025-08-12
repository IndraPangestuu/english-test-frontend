import { useEffect, useState } from 'react';
import { getOverallStats } from '../../api/analytics';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOverallStats()
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">{stats?.total_users || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Tests</p>
          <p className="text-2xl font-bold">{stats?.total_tests || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Questions</p>
          <p className="text-2xl font-bold">{stats?.total_questions || 0}</p>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { getAllTests, deleteTest } from '../../api/tests';
import Loader from '../../components/Loader';

export default function AdminTests() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTests() {
    setLoading(true);
    const data = await getAllTests();
    setTests(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm('Yakin hapus tes ini?')) {
      await deleteTest(id);
      loadTests();
    }
  }

  useEffect(() => {
    loadTests();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Tests</h1>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Title</th>
            <th>Date</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-2">{t.title}</td>
              <td>{t.date}</td>
              <td className="text-center">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(t.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

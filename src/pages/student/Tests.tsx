import { useEffect, useState } from 'react';
import { getAssignedTests, startTest } from '../../api/tests';
import Loader from '../../components/Loader';

export default function StudentTests() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTests() {
    setLoading(true);
    const data = await getAssignedTests();
    setTests(data);
    setLoading(false);
  }

  async function handleStart(testId: string) {
    await startTest(testId);
    window.location.href = `/test/${testId}`;
  }

  useEffect(() => {
    loadTests();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Tests</h1>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Title</th>
            <th>Assigned By</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-2">{t.title}</td>
              <td>{t.tutor_name}</td>
              <td className="text-center">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleStart(t.id)}
                >
                  Start Test
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { getTestsForReview, submitReview } from '../../api/tests';
import Loader from '../../components/Loader';

export default function TutorReviews() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTests() {
    setLoading(true);
    const data = await getTestsForReview();
    setTests(data);
    setLoading(false);
  }

  async function handleApprove(testId: string) {
    await submitReview(testId, { status: 'approved' });
    loadTests();
  }

  async function handleReject(testId: string) {
    await submitReview(testId, { status: 'rejected' });
    loadTests();
  }

  useEffect(() => {
    loadTests();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Review Submissions</h1>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Test Title</th>
            <th>Student</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-2">{t.title}</td>
              <td>{t.student_name}</td>
              <td>{t.status}</td>
              <td className="text-center space-x-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => handleApprove(t.id)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleReject(t.id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

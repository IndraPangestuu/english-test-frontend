import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTestResult } from '../../api/tests';
import Loader from '../../components/Loader';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      if (!id) return;
      const data = await getTestResult(id);
      setResult(data);
      setLoading(false);
    }
    fetchResult();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Test Result</h1>
      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Test:</strong> {result.title}</p>
        <p><strong>Score:</strong> {result.score} / {result.total}</p>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Review Answers</h2>
      <div className="space-y-4">
        {result.questions.map((q: any, idx: number) => (
          <div key={q.id} className="bg-gray-50 p-3 rounded border">
            <p className="font-medium">{idx + 1}. {q.text}</p>
            <p className={`mt-1 ${q.is_correct ? 'text-green-600' : 'text-red-600'}`}>
              Your Answer: {q.your_answer}
            </p>
            <p className="text-green-700">Correct Answer: {q.correct_answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link to="/student/history" className="bg-blue-500 text-white px-4 py-2 rounded">
          Back to History
        </Link>
      </div>
    </div>
  );
}

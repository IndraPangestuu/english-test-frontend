import { useEffect, useState } from 'react';
import { getAllQuestions, deleteQuestion } from '../../api/questions';
import Loader from '../../components/Loader';

export default function AdminQuestionBank() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadQuestions() {
    setLoading(true);
    const data = await getAllQuestions();
    setQuestions(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm('Yakin hapus soal ini?')) {
      await deleteQuestion(id);
      loadQuestions();
    }
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Question Bank</h1>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Question</th>
            <th>Category</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id} className="border-t">
              <td className="p-2">{q.text}</td>
              <td>{q.category}</td>
              <td className="text-center">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(q.id)}
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

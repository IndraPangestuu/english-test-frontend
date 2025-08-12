import { useEffect, useState } from 'react';
import { getAllQuestions } from '../../api/questions';
import { getAllStudents } from '../../api/users';
import { createTest } from '../../api/tests';
import StudentSelector from '../../components/StudentSelector';
import Loader from '../../components/Loader';

export default function TutorCreateTest() {
  const [title, setTitle] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const [q, s] = await Promise.all([getAllQuestions(), getAllStudents()]);
    setQuestions(q);
    setStudents(s);
    setLoading(false);
  }

  async function handleCreate() {
    if (!title || selectedQuestions.length === 0 || selectedStudents.length === 0) {
      alert('Lengkapi semua data');
      return;
    }
    await createTest({ title, question_ids: selectedQuestions, student_ids: selectedStudents });
    alert('Test created!');
    setTitle('');
    setSelectedQuestions([]);
    setSelectedStudents([]);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Test</h1>
      <div className="bg-white p-4 rounded shadow space-y-4">
        <input
          type="text"
          placeholder="Test Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <div>
          <h3 className="font-semibold mb-2">Select Questions</h3>
          <div className="space-y-2 max-h-40 overflow-auto border p-2 rounded">
            {questions.map((q) => (
              <label key={q.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(q.id)}
                  onChange={() =>
                    setSelectedQuestions((prev) =>
                      prev.includes(q.id) ? prev.filter((id) => id !== q.id) : [...prev, q.id]
                    )
                  }
                />
                {q.text}
              </label>
            ))}
          </div>
        </div>

        <StudentSelector
          students={students}
          selectedIds={selectedStudents}
          onChange={setSelectedStudents}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleCreate}
        >
          Create Test
        </button>
      </div>
    </div>
  );
}

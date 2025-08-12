import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestById, submitTestAnswers } from '../../api/tests';
import Loader from '../../components/Loader';
import { useFullscreenLock } from '../../hooks/useFullscreenLock';
import { usePreventCopyPaste } from '../../hooks/usePreventCopyPaste';

export default function TestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Anti-cheating hooks
  const { enterFullscreen } = useFullscreenLock({
    onExitFullscreen: () => {
      alert('⚠️ Kamu keluar dari fullscreen! Tes dibatalkan.');
      navigate('/student/tests');
    },
  });
  usePreventCopyPaste();

  useEffect(() => {
    async function fetchTest() {
      if (!id) return;
      const data = await getTestById(id);
      setTest(data);
      setLoading(false);
    }
    fetchTest();
  }, [id]);

  useEffect(() => {
    // masuk fullscreen saat load
    enterFullscreen(document.documentElement);
  }, []);

  function handleAnswerChange(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit() {
    if (!id) return;
    if (Object.keys(answers).length < test.questions.length) {
      if (!confirm('Masih ada soal yang belum dijawab. Kirim sekarang?')) return;
    }
    await submitTestAnswers(id, answers);
    navigate(`/test/${id}/result`);
  }

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{test.title}</h1>
      <div className="space-y-6">
        {test.questions.map((q: any, idx: number) => (
          <div key={q.id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold mb-2">{idx + 1}. {q.text}</p>
            {q.options?.map((opt: string, oidx: number) => (
              <label key={oidx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
}

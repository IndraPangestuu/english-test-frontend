import { useEffect, useState } from 'react';
import { getStudentAchievements } from '../../api/achievements';
import Loader from '../../components/Loader';
import BadgeCard from '../../components/BadgeCard';

export default function StudentAchievements() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentAchievements()
      .then((data) => setAchievements(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Achievements</h1>
      <div className="grid grid-cols-3 gap-4">
        {achievements.map((a) => (
          <BadgeCard key={a.id} badge={a} />
        ))}
      </div>
    </div>
  );
}

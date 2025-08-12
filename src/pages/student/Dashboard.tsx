import { useEffect, useState } from 'react';
import { getSkillHeatmap } from '../../api/analytics';
import Loader from '../../components/Loader';
import HeatmapChart from '../../components/HeatmapChart';

export default function StudentDashboard() {
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkillHeatmap()
      .then((data) => setHeatmapData(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Dashboard</h1>
      <HeatmapChart data={heatmapData} />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { getTutorReports } from '../../api/analytics';
import Loader from '../../components/Loader';
import HeatmapChart from '../../components/HeatmapChart';

export default function TutorReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTutorReports()
      .then((data) => setReports(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Performance Reports</h1>
      <HeatmapChart data={reports} />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { getAuditLogs } from '../../api/audit';
import Loader from '../../components/Loader';
import AuditTimeline from '../../components/AuditTimeline';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs()
      .then((data) => setLogs(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
      <AuditTimeline logs={logs} />
    </div>
  );
}

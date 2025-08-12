interface AuditTimelineProps {
  logs: { id: string; action: string; timestamp: string; user_email: string }[];
}

export default function AuditTimeline({ logs }: AuditTimelineProps) {
  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Audit Logs</h3>
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
            <p className="font-medium">{log.action}</p>
            <p className="text-gray-600 text-sm">By: {log.user_email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

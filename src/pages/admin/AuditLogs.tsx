import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import AuditTimeline from '../../components/AuditTimeline';
import { getAllAuditLogs } from '../../api/audit';
import type { AuditLog } from '../../types';

export default function AuditLogs() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const data = await getAllAuditLogs();
        setAuditLogs(data);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <AuditTimeline logs={auditLogs} />
      </div>
    </AdminLayout>
  );
}
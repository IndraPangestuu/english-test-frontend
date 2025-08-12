import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { getAllUsers } from '../../api/users';
import { getAllTests } from '../../api/tests';
import { getAllQuestions } from '../../api/questions';
import { getAllAuditLogs } from '../../api/audit';
import type { AuditLog } from '../../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTests: 0,
    totalQuestions: 0,
    recentActivity: [] as AuditLog[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, tests, questions, auditLogs] = await Promise.all([
          getAllUsers(),
          getAllTests(),
          getAllQuestions(),
          getAllAuditLogs()
        ]);

        setStats({
          totalUsers: users.length,
          totalTests: tests.length,
          totalQuestions: questions.length,
          recentActivity: auditLogs.slice(0, 10)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Tests</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalTests}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Questions</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalQuestions}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {stats.recentActivity.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">{log.action}</span>
                <span className="text-xs text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
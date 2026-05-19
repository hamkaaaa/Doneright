import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

export default function AdminDashboard({ user, onLogout }) {
  const [allTasks, setAllTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksRes, statsRes] = await Promise.all([
        adminAPI.getAllTasks(),
        adminAPI.getStatistics()
      ]);
      setAllTasks(tasksRes.tasks || []);
      setStats(statsRes);
    } catch (error) {
      console.error('Error loading admin data:', error);
      alert('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DoneRight Admin</h1>
              <p className="text-sm text-gray-600">{user.username}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Tugas</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.total || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Selesai</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats?.completed || 0}</p>
            <p className="text-sm text-gray-500 mt-1">{stats?.completionRate || 0}% completion</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Aktif</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.active || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats?.overdue || 0}</p>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Distribusi Prioritas</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">High Priority</span>
                <span className="text-sm">{stats?.highPriority || 0} tugas</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${stats?.total > 0 ? (stats?.highPriority || 0) / stats?.total * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Medium Priority</span>
                <span className="text-sm">{stats?.mediumPriority || 0} tugas</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${stats?.total > 0 ? (stats?.mediumPriority || 0) / stats?.total * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Low Priority</span>
                <span className="text-sm">{stats?.lowPriority || 0} tugas</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${stats?.total > 0 ? (stats?.lowPriority || 0) / stats?.total * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* All Tasks */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Monitoring Seluruh Tugas</h2>
          </div>
          <div className="p-6">
            {allTasks.length === 0 ? (
              <p className="text-center text-gray-500 py-12">Belum ada tugas dalam sistem</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Judul</th>
                      <th className="text-left py-3 px-4">Prioritas</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTasks.map(task => (
                      <tr key={task.task_id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            {task.description && (
                              <p className="text-sm text-gray-600">{task.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                            task.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {new Date(task.deadline).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

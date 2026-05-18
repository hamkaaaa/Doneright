import { useState, useMemo } from 'react';
import { User, Task, Category } from '../App';

type AdminDashboardProps = {
  user: User;
  onLogout: () => void;
};

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  // Mock data - In real app, this would come from API
  const [allTasks] = useState<Task[]>([
    {
      task_id: 'task-1',
      user_id: 'user-001',
      category_id: 'cat-1',
      title: 'Tugas RPL - Dokumen D2',
      description: 'Menyelesaikan dokumen desain sistem',
      priority: 'HIGH',
      deadline: '2026-05-20',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    },
    {
      task_id: 'task-2',
      user_id: 'user-001',
      category_id: 'cat-1',
      title: 'Tugas Basis Data',
      description: 'Membuat ERD',
      priority: 'MEDIUM',
      deadline: '2026-05-18',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    },
    {
      task_id: 'task-3',
      user_id: 'user-002',
      category_id: 'cat-2',
      title: 'Tugas Algoritma',
      description: 'Implementasi sorting',
      priority: 'HIGH',
      deadline: '2026-05-12',
      status: 'OVERDUE',
      created_at: new Date().toISOString(),
    },
    {
      task_id: 'task-4',
      user_id: 'user-003',
      category_id: 'cat-1',
      title: 'Presentasi PKM',
      description: 'Persiapan presentasi',
      priority: 'HIGH',
      deadline: '2026-05-15',
      status: 'COMPLETED',
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { category_id: 'cat-1', category_name: 'Akademik', category_type: 'default', created_at: new Date().toISOString() },
    { category_id: 'cat-2', category_name: 'Organisasi', category_type: 'default', created_at: new Date().toISOString() },
    { category_id: 'cat-3', category_name: 'Pribadi', category_type: 'custom', created_at: new Date().toISOString() },
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'overdue' | 'categories'>('overview');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Statistics
  const stats = useMemo(() => {
    const activeTasks = allTasks.filter(t => !t.deleted_at);
    const total = activeTasks.length;
    const completed = activeTasks.filter(t => t.status === 'COMPLETED').length;
    const overdue = activeTasks.filter(t => t.status === 'OVERDUE').length;
    const active = activeTasks.filter(t => t.status === 'ACTIVE').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Priority distribution
    const highPriority = activeTasks.filter(t => t.priority === 'HIGH').length;
    const mediumPriority = activeTasks.filter(t => t.priority === 'MEDIUM').length;
    const lowPriority = activeTasks.filter(t => t.priority === 'LOW').length;

    return {
      total,
      completed,
      overdue,
      active,
      completionRate,
      highPriority,
      mediumPriority,
      lowPriority,
    };
  }, [allTasks]);

  const overdueTasks = useMemo(() => {
    return allTasks.filter(t => !t.deleted_at && t.status === 'OVERDUE');
  }, [allTasks]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      alert('Nama kategori tidak boleh kosong');
      return;
    }

    const newCategory: Category = {
      category_id: `cat-${Date.now()}`,
      category_name: newCategoryName,
      category_type: 'custom',
      created_at: new Date().toISOString(),
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setShowAddCategoryModal(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const tasksWithCategory = allTasks.filter(t => t.category_id === categoryId && !t.deleted_at);

    if (tasksWithCategory.length > 0) {
      const confirmDelete = confirm(
        `Ada ${tasksWithCategory.length} tugas yang menggunakan kategori ini.\n\nApakah Anda ingin:\n- OK: Hapus kategori dan pertahankan tugas (kategori akan menjadi null)\n- Cancel: Batalkan penghapusan`
      );

      if (!confirmDelete) return;
    }

    setCategories(categories.filter(c => c.category_id !== categoryId));
  };

  const getCategoryName = (categoryId?: string) => {
    const category = categories.find(c => c.category_id === categoryId);
    return category?.category_name || 'Tanpa Kategori';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'High';
      case 'MEDIUM': return 'Medium';
      case 'LOW': return 'Low';
      default: return priority;
    }
  };

  // UC19: Generate Admin Report
  const handleGenerateReport = (format: 'PDF' | 'CSV') => {
    const activeTasks = allTasks.filter(t => !t.deleted_at);

    const reportData = activeTasks.map(task => ({
      judul: task.title,
      deskripsi: task.description || '-',
      kategori: getCategoryName(task.category_id),
      prioritas: getPriorityBadge(task.priority),
      deadline: new Date(task.deadline).toLocaleDateString('id-ID'),
      status: task.status === 'COMPLETED' ? 'Selesai' : task.status === 'OVERDUE' ? 'Terlambat' : 'Aktif',
      user_id: task.user_id,
    }));

    if (format === 'CSV') {
      // Generate CSV
      const headers = ['Judul', 'Deskripsi', 'Kategori', 'Prioritas', 'Deadline', 'Status', 'User ID'];
      const csvContent = [
        headers.join(','),
        ...reportData.map(row =>
          [row.judul, row.deskripsi, row.kategori, row.prioritas, row.deadline, row.status, row.user_id]
            .map(cell => `"${cell}"`)
            .join(',')
        ),
        '',
        '=== STATISTIK SISTEM ===',
        `Total Tugas,${stats.total}`,
        `Tugas Selesai,${stats.completed}`,
        `Tugas Aktif,${stats.active}`,
        `Tugas Overdue,${stats.overdue}`,
        `Tingkat Penyelesaian,${stats.completionRate}%`,
        `Prioritas High,${stats.highPriority}`,
        `Prioritas Medium,${stats.mediumPriority}`,
        `Prioritas Low,${stats.lowPriority}`,
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `laporan-sistem-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } else {
      // PDF generation would require a library like jsPDF
      alert(`Generate PDF: Fitur ini memerlukan library tambahan seperti jsPDF.\n\nStatistik Sistem:\n- Total Tugas: ${stats.total}\n- Selesai: ${stats.completed}\n- Aktif: ${stats.active}\n- Overdue: ${stats.overdue}\n- Completion Rate: ${stats.completionRate}%\n\nLaporan CSV telah tersedia.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DoneRight Admin</h1>
                <p className="text-sm text-gray-600">{user.full_name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex justify-between items-center border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === 'tasks'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Semua Tugas
              </button>
              <button
                onClick={() => setActiveTab('overdue')}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === 'overdue'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tugas Overdue
                {stats.overdue > 0 && (
                  <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                    {stats.overdue}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === 'categories'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Kelola Kategori
              </button>
            </div>
            {/* UC19: Generate Report Button */}
            <div className="mr-4">
              <button
                onClick={() => handleGenerateReport('CSV')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Laporan
              </button>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Total Tugas</h3>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500 mt-1">Tugas terdaftar</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Selesai</h3>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-sm text-green-600 mt-1">{stats.completionRate}% completion rate</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Aktif</h3>
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-sm text-gray-500 mt-1">Sedang berjalan</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.overdue}</p>
                <p className="text-sm text-red-600 mt-1">Perlu perhatian</p>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Prioritas</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">High Priority</span>
                    <span className="text-sm font-medium text-gray-900">{stats.highPriority} tugas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(stats.highPriority / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Medium Priority</span>
                    <span className="text-sm font-medium text-gray-900">{stats.mediumPriority} tugas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(stats.mediumPriority / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Low Priority</span>
                    <span className="text-sm font-medium text-gray-900">{stats.lowPriority} tugas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(stats.lowPriority / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoring Seluruh Tugas</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Judul</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Prioritas</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTasks.filter(t => !t.deleted_at).map(task => (
                      <tr key={task.task_id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{task.title}</p>
                            {task.description && (
                              <p className="text-sm text-gray-600">{task.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
            </div>
          </div>
        )}

        {/* Overdue Tasks Tab */}
        {activeTab === 'overdue' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tugas Overdue ({overdueTasks.length})
              </h3>
              {overdueTasks.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600">Tidak ada tugas yang overdue</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {overdueTasks.map(task => (
                    <div key={task.task_id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                              task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {task.priority}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Deadline: {new Date(task.deadline).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Kelola Kategori Tugas</h3>
                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Kategori
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(category => (
                  <div key={category.category_id} className="border rounded-lg p-4 hover:border-purple-300 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{category.category_name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {category.category_type === 'default' ? 'Kategori Default' : 'Kategori Custom'}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Dibuat: {new Date(category.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      {category.category_type !== 'default' && (
                        <button
                          onClick={() => handleDeleteCategory(category.category_id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Tambah Kategori Baru</h3>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kategori
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="Masukkan nama kategori"
              />
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

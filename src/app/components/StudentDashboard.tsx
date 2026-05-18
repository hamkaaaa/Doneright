import { useState, useMemo } from 'react';
import { User, Task, Category, Priority, TaskStatus } from '../App';

type StudentDashboardProps = {
  user: User;
  onLogout: () => void;
};

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  // Mock data categories
  const [categories] = useState<Category[]>([
    { category_id: 'cat-1', category_name: 'Akademik', category_type: 'default', created_at: new Date().toISOString() },
    { category_id: 'cat-2', category_name: 'Organisasi', category_type: 'default', created_at: new Date().toISOString() },
    { category_id: 'cat-3', category_name: 'Pribadi', category_type: 'custom', created_at: new Date().toISOString() },
  ]);

  // Mock data tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      task_id: 'task-1',
      user_id: user.user_id,
      category_id: 'cat-1',
      title: 'Tugas RPL - Dokumen D2',
      description: 'Menyelesaikan dokumen desain sistem untuk tugas RPL',
      priority: 'HIGH',
      deadline: '2026-05-20',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    },
    {
      task_id: 'task-2',
      user_id: user.user_id,
      category_id: 'cat-1',
      title: 'Tugas Basis Data',
      description: 'Membuat ERD untuk sistem perpustakaan',
      priority: 'MEDIUM',
      deadline: '2026-05-18',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    },
    {
      task_id: 'task-3',
      user_id: user.user_id,
      category_id: 'cat-2',
      title: 'Rapat HMTC',
      description: 'Meeting koordinasi divisi IT',
      priority: 'LOW',
      deadline: '2026-05-16',
      status: 'COMPLETED',
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    priority: 'MEDIUM' as Priority,
    deadline: '',
  });

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | TaskStatus>('ALL');
  const [filterPriority, setFilterPriority] = useState<'ALL' | Priority>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority'>('deadline');
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('list'); // UC21: View mode

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => !task.deleted_at);

    // Search
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Filter by priority
    if (filterPriority !== 'ALL') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // UC09: Filter by category
    if (filterCategory !== 'ALL') {
      filtered = filtered.filter(task => task.category_id === filterCategory);
    }

    // Sort
    if (sortBy === 'deadline') {
      filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    return filtered;
  }, [tasks, searchQuery, filterStatus, filterPriority, filterCategory, sortBy]);

  // Progress calculation
  const totalTasks = tasks.filter(t => !t.deleted_at).length;
  const completedTasks = tasks.filter(t => !t.deleted_at && t.status === 'COMPLETED').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // UC21: Group tasks by category
  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: { category: Category | null; tasks: Task[] } } = {};

    filteredTasks.forEach(task => {
      const categoryId = task.category_id || 'uncategorized';
      if (!groups[categoryId]) {
        groups[categoryId] = {
          category: task.category_id ? categories.find(c => c.category_id === task.category_id) || null : null,
          tasks: []
        };
      }
      groups[categoryId].tasks.push(task);
    });

    return groups;
  }, [filteredTasks, categories]);

  const handleAddTask = () => {
    if (!formData.title || !formData.deadline) {
      alert('Judul dan deadline harus diisi');
      return;
    }

    const newTask: Task = {
      task_id: `task-${Date.now()}`,
      user_id: user.user_id,
      category_id: formData.category_id || undefined,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      deadline: formData.deadline,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    setShowAddModal(false);
    setFormData({
      title: '',
      description: '',
      category_id: '',
      priority: 'MEDIUM',
      deadline: '',
    });
  };

  const handleEditTask = () => {
    if (!editingTask) return;

    setTasks(tasks.map(task =>
      task.task_id === editingTask.task_id
        ? { ...editingTask, updated_at: new Date().toISOString() }
        : task
    ));
    setEditingTask(null);
    setShowDetailModal(false);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      setTasks(tasks.map(task =>
        task.task_id === taskId
          ? { ...task, deleted_at: new Date().toISOString() }
          : task
      ));
      setShowDetailModal(false);
    }
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.task_id === taskId) {
        const isCompleted = task.status === 'COMPLETED';
        return {
          ...task,
          status: isCompleted ? 'ACTIVE' : 'COMPLETED',
          completed_at: isCompleted ? undefined : new Date().toISOString(),
        };
      }
      return task;
    }));
  };

  const getCategoryName = (categoryId?: string) => {
    const category = categories.find(c => c.category_id === categoryId);
    return category?.category_name || 'Tanpa Kategori';
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'HIGH': return 'High';
      case 'MEDIUM': return 'Medium';
      case 'LOW': return 'Low';
    }
  };

  // UC22: Generate personal report
  const handleGenerateReport = (format: 'PDF' | 'CSV') => {
    const reportData = filteredTasks.map(task => ({
      judul: task.title,
      deskripsi: task.description || '-',
      kategori: getCategoryName(task.category_id),
      prioritas: getPriorityBadge(task.priority),
      deadline: new Date(task.deadline).toLocaleDateString('id-ID'),
      status: task.status === 'COMPLETED' ? 'Selesai' : task.status === 'OVERDUE' ? 'Terlambat' : 'Aktif',
    }));

    if (format === 'CSV') {
      // Generate CSV
      const headers = ['Judul', 'Deskripsi', 'Kategori', 'Prioritas', 'Deadline', 'Status'];
      const csvContent = [
        headers.join(','),
        ...reportData.map(row =>
          [row.judul, row.deskripsi, row.kategori, row.prioritas, row.deadline, row.status]
            .map(cell => `"${cell}"`)
            .join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `laporan-tugas-${user.full_name}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } else {
      // PDF generation would require a library like jsPDF
      alert(`Generate PDF: Fitur ini memerlukan library tambahan seperti jsPDF. Data laporan:\n\nTotal Tugas: ${totalTasks}\nTugas Selesai: ${completedTasks}\nProgress: ${progressPercentage}%\n\nLaporan CSV telah tersedia.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DoneRight</h1>
                <p className="text-sm text-gray-600">Selamat datang, {user.full_name}</p>
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
        {/* Progress Widget */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white mb-8">
          <h2 className="text-lg font-semibold mb-4">Progress Penyelesaian Tugas</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="bg-white bg-opacity-20 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>{completedTasks} dari {totalTasks} tugas selesai</span>
                <span className="font-bold">{progressPercentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">Daftar Tugas</h2>
              {/* UC21: View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    viewMode === 'list'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Daftar
                </button>
                <button
                  onClick={() => setViewMode('grouped')}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    viewMode === 'grouped'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Per Kategori
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              {/* UC22: Generate Report Button */}
              <button
                onClick={() => handleGenerateReport('CSV')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Laporan
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Tugas
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Cari tugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Aktif</option>
              <option value="COMPLETED">Selesai</option>
              <option value="OVERDUE">Terlambat</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            {/* UC09: Filter by Category */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="deadline">Urutkan: Deadline</option>
              <option value="priority">Urutkan: Prioritas</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        {viewMode === 'list' ? (
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 text-lg">Tidak ada tugas ditemukan</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div
                  key={task.task_id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={task.status === 'COMPLETED'}
                      onChange={() => handleToggleComplete(task.task_id)}
                      className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-lg font-semibold ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setShowDetailModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          Detail
                        </button>
                      </div>
                      {task.description && (
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {getPriorityBadge(task.priority)}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          {getCategoryName(task.category_id)}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          Deadline: {new Date(task.deadline).toLocaleDateString('id-ID')}
                        </span>
                        {task.status === 'COMPLETED' && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                            ✓ Selesai
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* UC21: Grouped by Category View */
          <div className="space-y-6">
            {Object.keys(groupedTasks).length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 text-lg">Tidak ada tugas ditemukan</p>
              </div>
            ) : (
              Object.entries(groupedTasks).map(([categoryId, { category, tasks: categoryTasks }]) => (
                <div key={categoryId} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      {category?.category_name || 'Tanpa Kategori'}
                    </h3>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {categoryTasks.length} tugas
                    </span>
                  </div>
                  <div className="space-y-3">
                    {categoryTasks.map(task => (
                      <div
                        key={task.task_id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-sm transition"
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={task.status === 'COMPLETED'}
                            onChange={() => handleToggleComplete(task.task_id)}
                            className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className={`font-semibold ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {task.title}
                              </h4>
                              <button
                                onClick={() => {
                                  setSelectedTask(task);
                                  setShowDetailModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                              >
                                Detail
                              </button>
                            </div>
                            {task.description && (
                              <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                {getPriorityBadge(task.priority)}
                              </span>
                              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                {new Date(task.deadline).toLocaleDateString('id-ID')}
                              </span>
                              {task.status === 'COMPLETED' && (
                                <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                  ✓ Selesai
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Tambah Tugas Baru</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Tugas *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Masukkan judul tugas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  rows={3}
                  placeholder="Deskripsi tugas (opsional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="">Tanpa Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioritas *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline *
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail/Edit Modal */}
      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Detail Tugas</h3>
            </div>
            <div className="p-6 space-y-4">
              {editingTask ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                    <textarea
                      value={editingTask.description}
                      onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioritas</label>
                    <select
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as Priority })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                    <input
                      type="date"
                      value={editingTask.deadline}
                      onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* UC20: Show all task attributes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                    <p className="text-gray-900 font-semibold">{selectedTask.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <p className="text-gray-900">{selectedTask.description || '-'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                      <p className="text-gray-900">{getCategoryName(selectedTask.category_id)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedTask.priority)}`}>
                        {getPriorityBadge(selectedTask.priority)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                      <p className="text-gray-900">{new Date(selectedTask.deadline).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <p className="text-gray-900">
                        {selectedTask.status === 'COMPLETED' ? '✓ Selesai' : selectedTask.status === 'OVERDUE' ? '⚠ Terlambat' : 'Aktif'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dibuat</label>
                      <p className="text-gray-600 text-sm">{new Date(selectedTask.created_at).toLocaleDateString('id-ID')} {new Date(selectedTask.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    {selectedTask.completed_at && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diselesaikan</label>
                        <p className="text-gray-600 text-sm">{new Date(selectedTask.completed_at).toLocaleDateString('id-ID')} {new Date(selectedTask.completed_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="p-6 border-t flex gap-3 justify-between">
              <button
                onClick={() => handleDeleteTask(selectedTask.task_id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Hapus
              </button>
              <div className="flex gap-3">
                {editingTask ? (
                  <>
                    <button
                      onClick={() => setEditingTask(null)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleEditTask}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Simpan
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      Tutup
                    </button>
                    <button
                      onClick={() => setEditingTask(selectedTask)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

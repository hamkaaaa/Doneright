import { useState, useEffect } from 'react';
import { tasksAPI, categoriesAPI } from '../../services/api';

export default function StudentDashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    deadline: '',
    category_id: null
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksRes, catsRes] = await Promise.all([
        tasksAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      setTasks(tasksRes.tasks || []);
      setCategories(catsRes.categories || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.deadline) {
      alert('Title dan deadline harus diisi');
      return;
    }

    try {
      await tasksAPI.create(newTask);
      await loadData();
      setShowAddModal(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', deadline: '', category_id: null });
    } catch (error) {
      alert(error.message || 'Gagal menambah tugas');
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await tasksAPI.toggleComplete(taskId);
      await loadData();
    } catch (error) {
      alert(error.message || 'Gagal mengubah status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Hapus tugas ini?')) return;

    try {
      await tasksAPI.delete(taskId);
      await loadData();
    } catch (error) {
      alert(error.message || 'Gagal menghapus tugas');
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === 'HIGH') return 'bg-red-100 text-red-700';
    if (priority === 'MEDIUM') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusColor = (status) => {
    if (status === 'COMPLETED') return 'bg-green-100 text-green-700';
    if (status === 'OVERDUE') return 'bg-red-100 text-red-700';
    return 'bg-blue-100 text-blue-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">DoneRight</h1>
              <p className="text-sm text-gray-600">Hello, {user.username}</p>
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Tugas</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{tasks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Selesai</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {tasks.filter(t => t.status === 'COMPLETED').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {tasks.filter(t => t.status === 'OVERDUE').length}
            </p>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Daftar Tugas</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Tambah Tugas
            </button>
          </div>

          <div className="p-6">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-500 py-12">Belum ada tugas</p>
            ) : (
              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.task_id} className="border rounded-lg p-4 hover:border-blue-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(task.deadline).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleToggleComplete(task.task_id)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          {task.status === 'COMPLETED' ? 'Batal' : 'Selesai'}
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.task_id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Tambah Tugas Baru</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Prioritas</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select
                  value={newTask.category_id || ''}
                  onChange={(e) => setNewTask({...newTask, category_id: e.target.value || null})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Tanpa Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleAddTask}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

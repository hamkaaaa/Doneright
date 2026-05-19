import { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';

export type User = {
  id_users: string;
  username: string;
  email: string;
  role: 'mahasiswa' | 'admin';
};

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'ACTIVE' | 'COMPLETED' | 'OVERDUE';

export type Task = {
  task_id: string;
  user_id: string;
  category_id?: string;
  title: string;
  description?: string;
  priority: Priority;
  deadline: string;
  status: TaskStatus;
  completed_at?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

export type Category = {
  category_id: string;
  category_name: string;
  category_type: string;
  created_at: string;
};

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'student-dashboard' | 'admin-dashboard'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('student-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onSwitchToRegister={() => setCurrentView('register')}
        />
      )}
      {currentView === 'register' && (
        <RegisterPage
          onRegisterSuccess={() => setCurrentView('login')}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      )}
      {currentView === 'student-dashboard' && currentUser && (
        <StudentDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {currentView === 'admin-dashboard' && currentUser && (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

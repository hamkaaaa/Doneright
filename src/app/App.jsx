import { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
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

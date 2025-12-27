import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MaintenanceProvider, useMaintenance } from './context/MaintenanceContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import EquipmentPage from './pages/EquipmentPage';
import KanbanBoard from './pages/KanbanBoard';
import TeamsPage from './pages/TeamsPage';
import CalendarView from './pages/CalendarView';
import Dashboard from './pages/Dashboard';
import WorkCenterPage from './pages/WorkCenterPage';
import EquipmentCategoryPage from './pages/EquipmentCategoryPage';
import ReportingPage from './pages/ReportingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function AppContent() {
  const { loading: maintenanceLoading } = useMaintenance();
  const { loading: authLoading } = useAuth();

  if (maintenanceLoading || authLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--color-primary)' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ fontWeight: 600 }}>Connecting to Gear Guard Backend...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div id="root">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="*" element={
          <ProtectedRoute>
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/equipment" element={<EquipmentPage />} />
                <Route path="/equipment-categories" element={<EquipmentCategoryPage />} />
                <Route path="/work-centers" element={<WorkCenterPage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/kanban" element={<KanbanBoard />} />
                <Route path="/calendar" element={<CalendarView />} />
                <Route path="/reporting" element={<ReportingPage />} />
              </Routes>
            </main>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <MaintenanceProvider>
          <AppContent />
        </MaintenanceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import { routesConfig } from './routes/config';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import TestPage from './pages/test/TestPage';
import ResultPage from './pages/test/ResultPage';
import Unauthorized from './pages/Unauthorized';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const { fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Test routes */}
        <Route
          path="/test/:testId"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <TestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/:testId/result"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ResultPage />
            </ProtectedRoute>
          }
        />

        {/* Dynamic routes from config */}
        {routesConfig.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute allowedRoles={route.allowedRoles}>
                {route.element}
              </ProtectedRoute>
            }
          />
        ))}

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

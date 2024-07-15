// src/App.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/Loginpage';
import ShortenUrlPage from './pages/shortenUrlPage';
import UserUrlsPage from './pages/UserUrlsPage';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';


const ProtectedRoute = ({ children }) => {
  const { userId, loading } = useAuth();
  console.log(userId)
  console.log('ProtectedRoute - userId:', userId, 'loading:', loading);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  return userId ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/shorten" element={
          <ProtectedRoute>
            <ShortenUrlPage />
          </ProtectedRoute>
        } />
        <Route path="/urls" element={
          <ProtectedRoute>
            <UserUrlsPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

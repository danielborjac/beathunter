import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import NormalGame from './pages/NormalGame';
import LeaderboardPage from './pages/LeaderboardPage';
import CategoriesScreen from './pages/CategoriesPage';
import DashboardRoutes from './router/DashboardRoutes';
import AdminRoute from './components/AdminRoute';



function App() {

  return (
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/categories" element={<CategoriesScreen />} />
          <Route path="/game" element={
            <PrivateRoute>
              <NormalGame />
            </PrivateRoute>
          } />
          <Route path="/dashboard/*" element={
            <AdminRoute>
              <DashboardRoutes />
            </AdminRoute>
          } />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
        <Footer />
      </Router>
    
  );
}

export default App;
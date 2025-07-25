import './App.css'
import Layout from './Layout'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { token } = useAuth();

  return (
    <BrowserRouter>
      {token ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;

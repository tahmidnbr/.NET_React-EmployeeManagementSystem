import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute     from './components/ProtectedRoute';
import LoginPage          from './pages/LoginPage';
import HomePage           from './pages/HomePage';
import AddEmployeePage    from './pages/AddEmployeePage';
import EditEmployeePage   from './pages/EditEmployeePage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute><AddEmployeePage /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditEmployeePage /></ProtectedRoute>} />
        <Route path="/employee/:id" element={<ProtectedRoute><EmployeeDetailPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
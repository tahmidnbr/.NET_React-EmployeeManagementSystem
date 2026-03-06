import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage           from './pages/HomePage';
import AddEmployeePage    from './pages/AddEmployeePage';
import EditEmployeePage   from './pages/EditEmployeePage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<HomePage />} />
        <Route path="/add"            element={<AddEmployeePage />} />
        <Route path="/edit/:id"       element={<EditEmployeePage />} />
        <Route path="/employee/:id"   element={<EmployeeDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
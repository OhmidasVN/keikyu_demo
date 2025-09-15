import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import CarList from "./pages/car/CarList";
import CarAdd from "./pages/car/CarAdd";
import CarEdit from "./pages/car/CarEdit";
import Account from "./pages/Account";
import Employee from "./pages/Employee";
import ImportData from "./pages/ImportData";

function RequireAuth({ children }: { children: JSX.Element }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/car" element={<CarList />} />
        <Route path="/car/add" element={<CarAdd />} />
        <Route path="/car/edit/:id" element={<CarEdit />} />
        <Route path="/account" element={<Account />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/import-data" element={<ImportData />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import StudentDashboard from "./page/dashboard/studentDashboard";
import AdminDashboard from "./page/dashboard/AdminDashboard";
import LandingPage from "./page/Landing";

/** Redirects to /login if no token in localStorage */
const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
};

/** Redirects to /admin if adminToken exists, else to /login */
const AdminRoute = ({ element }: { element: React.ReactElement }) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<StudentDashboard />} />} />
        <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

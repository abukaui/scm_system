import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Login from "./page/Login";
import Register from "./page/Register";
import StudentDashboard from "./page/dashboard/studentDashboard";
import AdminDashboard from "./page/dashboard/admin/AdminDashboard";
import LandingPage from "./page/Landing";
import ForgotPassword from "./page/ForgotPassword";
import ResetPassword from "./page/ResetPassword";

/** Redirects to /login if no token in localStorage */
const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
};

/** Redirects to /admin if admin role exists, else to /login */
const AdminRoute = ({ element }: { element: React.ReactElement }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return (token && role === "admin") ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            fontFamily: 'Inter, sans-serif',
            borderRadius: '16px',
            background: '#ffffff',
            color: '#0f172a',
            padding: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            fontWeight: 600,
            fontSize: '14px'
          },
        }} 
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<StudentDashboard />} />} />
          <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

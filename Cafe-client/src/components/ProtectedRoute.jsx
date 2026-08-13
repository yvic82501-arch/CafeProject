import { Navigate } from "react-router-dom";
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;

import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  if (!token || !user) {
    return <navigate to="/login" />;
  }

  if (user.role !== "admin" && user.role !== "superadmin") {
    return <navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;

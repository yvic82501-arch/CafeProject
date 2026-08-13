import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <nav className="bg-yellow-700 text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white-xl font-bold">
          QueueIt..
        </Link>
        <div className="flex gap-6">
          <Link to="/" className="text-white hover:underline">
            Home
          </Link>

          {token ? (
            <button
              onClick={logout}
              className="text-white cursor-pointer hover:underline"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-white hover:underline">
              Login
            </Link>
          )}
          <Link to="/admin" className="text-white hover:underline">
            Admin
          </Link>
          <Link to="/register" className="text-white hover:underline">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

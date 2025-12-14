import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-pink-600 flex items-center gap-2">
          🍬 SweetShop
        </Link>

        {/* Menu */}
        <div className="space-x-6 font-medium">
          {user ? (
            <>
              <span className="text-gray-500">
                Hello, <span className="text-gray-800 font-bold">{user.role === 'ADMIN' ? 'Admin' : 'User'}</span>
              </span>
              <button 
                onClick={handleLogout} 
                className="text-red-500 hover:text-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-pink-600">Login</Link>
              <Link 
                to="/register" 
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
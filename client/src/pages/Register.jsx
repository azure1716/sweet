import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Register
      await API.post("/auth/register", { email, password });
      // 2. Auto-Login
      const res = await API.post("/auth/login", { email, password });
      login(res.data.token);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>
        
        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-bold mb-2">Email</label>
          <input 
            type="email" required 
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-pink-500"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-bold mb-2">Password</label>
          <input 
            type="password" required 
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-pink-500"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded font-bold hover:bg-pink-700 transition">
          Create Account
        </button>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-pink-600 font-bold hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [sweets, setSweets] = useState([]);
  const { user } = useContext(AuthContext);

  // Fetch data from Backend
  const fetchSweets = async () => {
    try {
      const res = await API.get("/sweets");
      setSweets(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Could not load inventory");
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handlePurchase = async (id) => {
    try {
      await API.post(`/sweets/${id}/purchase`);
      toast.success("Sweet purchased!");
      fetchSweets(); // Refresh the list to show new quantity
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to buy");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🍬 Inventory</h1>
        {/* If user is Admin, we could show an 'Add Sweet' button here later */}
      </div>
      
      {sweets.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No sweets found. Ask an admin to add some!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweets.map((sweet) => (
            <div key={sweet._id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
                  <span className="text-xs font-bold uppercase tracking-wide bg-pink-100 text-pink-600 px-2 py-1 rounded mt-2 inline-block">
                    {sweet.category}
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-700">${sweet.price}</span>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Stock: <span className={`font-bold ${sweet.quantity === 0 ? 'text-red-500' : 'text-gray-800'}`}>
                    {sweet.quantity}
                  </span>
                </p>

                <button
                  onClick={() => handlePurchase(sweet._id)}
                  disabled={sweet.quantity === 0}
                  className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
                    sweet.quantity > 0 
                      ? 'bg-pink-600 text-white hover:bg-pink-700 shadow-md hover:shadow-lg' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {sweet.quantity > 0 ? 'Buy Now' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function DashboardStats() {
  const [stats, setStats] = useState([]);
  const navigate = useNavigate();

  const getStats = async () => {
    try {
      const response = await api.get("/stat/dashboard");
      setStats(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <div className="min-h-screen bg-sky-100 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/admin")}
          className="mb-5 bg-gray-600 text-white px-4 py-2 rounded-lg hover:shadow-lg"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-6">Dashboard Statistics</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Served Users</p>
            <h2 className="text-3xl font-bold mt-2">{stats.served || 0}</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow ">
            <p className="text-gray-500">Active Queues</p>
            <h2 className="text-3xl font-bold mt-2">{stats.queues || 0}</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Venues</p>
            <h2 className="text-3xl font-bold mt-2">{stats.venues || 0}</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500"> Users</p>
            <h2 className="text-3xl font-bold mt-2">{stats.users || 0}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;

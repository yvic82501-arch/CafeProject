import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const getVenues = async () => {
    try {
      const response = await api.get("/venue");

      setVenues(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVenues();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-sky-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <button
          onClick={() => navigate("/admin/add-queue")}
          className="bg-green-600 text-white px-5 py-2 rounded-lg mb-6 hover:shadow-lg "
        >
          + Add Queue
        </button>
        <button
          onClick={() => navigate("/admin/dash-stat")}
          className="bg-purple-600 text-white ml-2 px-5 py-2 rounded-lg mb-6 hover:shadow-lg"
        >
          Dashboard Stats
        </button>

        {venues.map((venue) => (
          <div key={venue._id} className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-2xl font-bold">{venue.name}</h2>

            <p className="text-gray-500 mb-5">{venue.location}</p>
            <h3 className="text-lg font-semibold mb-3">Queues</h3>
            {venue.queue && venue.queue.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {venue.queue.map((queue) => (
                  <div
                    key={queue._id}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-bold">{queue.name}</h4>
                    </div>

                    <button
                      onClick={() => navigate(`/admin/queue/${queue._id}`)}
                      className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg"
                    >
                      Manage Queue
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No queues available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;

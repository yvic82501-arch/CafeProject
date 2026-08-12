import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function QueueControl() {
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);

  const [name, setName] = useState("");
  const [venueId, setVenueId] = useState("");
  const [averageServiceTime, setAverageServiceTime] = useState(120);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getVenues = async () => {
    try {
      const response = await api.get("/venue");
      setVenues(response.data.data);
    } catch (error) {
      console.log(error);
      setMessage("Unable to load venues");
    }
  };
  useEffect(() => {
    getVenues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await api.post("/queue", {
        name,
        venueId,
        averageServiceTime: Number(averageServiceTime),
      });
      setMessage("Queue added successfully!");

      setName("");
      setVenueId("");
      setAverageServiceTime(120);

      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Failed to add queue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 p-6">
      <div className="max-w-lg mx-auto">
        <div className="bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-6">Add Queue</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-medium mb-2">Queue Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Queue Name"
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Select Venue</label>
              <select
                value={venueId}
                onChange={(e) => setVenueId(e.target.value)}
                className="w-full border p-3 rounded-lg"
                required
              >
                <option value="">Select a venue</option>
                {venues.map((venue) => (
                  <option key={venue._id} value={venue._id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">
                Average Service Time (seconds)
              </label>
              <input
                type="number"
                value={averageServiceTime}
                onChange={(e) => setAverageServiceTime(e.target.value)}
                className="w-full border p-3 rounded-lg"
                min="1"
                required
              />
            </div>
            {message && (
              <p className="mb-4 text-center text-blue-600">{message}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 hover:shadow-lg"
            >
              {loading ? "Adding..." : "Add Queue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default QueueControl;

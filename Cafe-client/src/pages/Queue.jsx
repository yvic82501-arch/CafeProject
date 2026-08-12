import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

function Queue() {
  const { queueId } = useParams();

  const navigate = useNavigate();

  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(false);

  const getQueue = async () => {
    try {
      const response = await api.get(`/queue/${queueId}`);
      setQueue(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getQueue();
  }, [queueId]);

  const joinQueue = async () => {
    try {
      const response = await api.post(`/queue/${queueId}/join`);
      console.log(response.data);

      navigate(`/status/${queueId}`);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to join queue");
    }
    setLoading(false);
  };
  if (!queue) {
    return <div className="p-10">loading...</div>;
  }

  return (
    <div className="bg-sky-100 min-h-screen">
      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl hover:shadow-lg transition-shadow ease-in-out p-8">
          <h1 className="text-3xl font-bold">{queue.name}</h1>
          <div className="mt-6 space-y-3">
            <p>Average service time: {queue.averageServiceTime} seconds</p>
            <p>
              Current queue:{" "}
              {queue.queue?.filter((user) => user.status === "waiting")
                .length || 0}{" "}
              users
            </p>
            <p>Now Serving: {queue.nowServing}</p>
          </div>
          <button
            onClick={joinQueue}
            disabled={loading || !queue.isActive}
            className="w-full mt-8 bg-sky-600 text-white py-3 rounded-lg disabled:bg-gray-400 hover:shadow-lg"
          >
            {loading ? "Joining..." : "Join Queue"}
          </button>
          <button
            onClick={() => navigate("/history")}
            className="bg-yellow-600 text-white mt-2 px-4 py-2 rounded-lg hover:shadow-lg"
          >
            History
          </button>
        </div>
      </div>
    </div>
  );
}

export default Queue;

import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

function AdminQueue() {
  const { queueId } = useParams();
  const navigate = useNavigate();

  const [queue, setQueue] = useState(null);

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

    const interval = setInterval(() => {
      getQueue();
    }, 3000);

    return () => clearInterval(interval);
  }, [queueId]);

  const serveUser = async () => {
    try {
      await api.patch(`/queue/${queueId}/serve`);

      getQueue();
    } catch (error) {
      console.log(error);
    }
  };

  const skipUser = async () => {
    try {
      await api.patch(`/queue/${queueId}/skip`);

      getQueue();
    } catch (error) {
      console.log(error);
    }
  };

  const pauseQueue = async () => {
    try {
      await api.patch(`/queue/${queueId}/pause`);

      getQueue();
    } catch (error) {
      console.log(error);
    }
  };

  const resetQueue = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset this queue?",
    );
    if (!confirmReset) {
      return;
    }
    try {
      await api.patch(`queue/${queueId}/reset`);
      alert("Queue reset successfully");
      getQueue();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to reset queue");
    }
  };

  if (!queue) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  const waitingUsers = queue.queue.filter((user) => user.status === "waiting");

  return (
    <div className="min-h-screen bg-sky-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold">{queue.name}</h1>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Now Serving</p>

            <p className="text-3xl font-bold text-blue-600">
              {queue.nowServing}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Waiting</p>

            <p className="text-3xl font-bold">{waitingUsers.length}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Status</p>

            <p className="text-3xl font-bold">
              {queue.isActive ? "Active" : "Paused"}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mt-6">
          <h2 className="text-xl font-bold mb-4">Queue Controls</h2>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={serveUser}
              className="bg-green-600 text-white px-5 py-2 rounded-lg cursor-pointer hover:shadow-lg"
            >
              Serve
            </button>

            <button
              onClick={skipUser}
              className="bg-yellow-500 text-white px-5 py-2 rounded-lg cursor-pointer hover:shadow-lg"
            >
              Skip
            </button>

            <button
              onClick={pauseQueue}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg cursor-pointer hover:shadow-lg"
            >
              {queue.isActive ? "Pause" : "Resume"}
            </button>
            <button
              onClick={resetQueue}
              className="bg-red-600 text-white px-5 py-2 rounded-lg cursor-pointer hover:shadow-lg"
            >
              Reset Queue
            </button>
            <button
              onClick={() => navigate(`/admin/queue/${queueId}/analytics`)}
              className="bg-green-600 text-white px-5 py-2 rounded-lg cursor-pointer hover:shadow-lg"
            >
              Analytics
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mt-6">
          <h2 className="text-xl font-bold mb-4">Waiting Users</h2>

          {waitingUsers.length === 0 ? (
            <p className="text-gray-500">No users waiting.</p>
          ) : (
            <div className="space-y-3">
              {waitingUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center border p-4 rounded-lg"
                >
                  <div>
                    <p className="font-bold">Token no. {user.tokenNumber}</p>

                    <p className="text-gray-500">
                      Joined: {new Date(user.joinedAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                    Waiting
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminQueue;

import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

function QueueStatus() {
  const { queueId } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const getQueueStatus = async () => {
    try {
      const response = await api.get(`/queue/${queueId}/status`);
      const dat = response.data.data;
      setStatus(dat);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQueueStatus();

    const interval = setInterval(() => {
      getQueueStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [queueId]);

  const leaveQueue = async () => {
    try {
      await api.delete(`/queue/${queueId}/leave`);

      alert("You have left the queue");
      navigate("/");
    } catch (error) {
      alert(error.respone?.data?.message || "Unable to leave queue");
    }
  };
  if (loading) {
    return <div className="p-10 text-center">Loading Queue status</div>;
  }

  if (!status) {
    return <div className="p-10 text-center">Unabel to load Queue status</div>;
  }

  return (
    <div className="min-h-screen bg-sky-100">
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">Queue Status</h1>
        <div className="bg-white rounded-xl shadow p-6 mt-6">
          <div className="text-center">
            <p className="text-gray-500">Your Token</p>
            <h2 className="text-5xl font-bold text-blue-600 mt-2">
              {status.tokenNumber}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 m-3 ">
            <div className="bg-gray-100 p-4 m-3 rounded-lg text-center">
              <p className="text-gray-500">Position</p>
              <p className="text-2xl font-bold">{status.position}</p>
            </div>
            <div className="bg-gray-100 p-4 m-3 rounded-lg text-center">
              <p className="text-gray-500">Now Serving</p>
              <p className="text-2xl font-bold">{status.nowServing}</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 m-3 rounded-lg text-center">
            <p className="text-gray-600">Estimate wait</p>
            <p className="text-2xl font-bold text-blue-600">
              {status.eta}seconds
            </p>
          </div>
          <div className="bg-gray-100 p-4 m-3 rounded-lg text-center">
            <p className="text-gray-600">Message</p>
            <p className="text-2xl font-bold text-blue-600">{status.message}</p>
          </div>
          <button
            onClick={leaveQueue}
            className="w-full bg-red-500 text-white py-3 rounded-lg mt-6 hover:shadow-lg"
          >
            Leave Queue
          </button>
        </div>
        <p className="text-center text-gray-500 mt-5">
          Queue updates every 5 seconds
        </p>
        {status.status === "served" && (
          <div className="mt-6 text-center">
            <p className="text-green-600 text-xl font-bold mb-4">
              Your food has been served! 🎉
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:shadow-lg"
            >
              Received
            </button>
          </div>
        )}
        {status.status === "skipped" && (
          <div className="mt-6 text-center">
            <p className="text-green-600 text-xl font-bold mb-4">
              You have been skipped!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:shadow-lg"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QueueStatus;

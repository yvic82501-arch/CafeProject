import { useEffect, useState } from "react";
import api from "../api/api";

function UserHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const getHistory = async () => {
    try {
      const response = await api.get("/stat/history");

      setHistory(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading history...</div>;
  }

  return (
    <div className="min-h-screen bg-sky-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">User History</h1>

        {history.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500">No user history found.</p>
          </div>
        ) : (
          <div className="space-y-4 ">
            {history.map((history) => (
              <div
                key={history._id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold">
                      Token no. {history.tokenNumber}
                    </p>

                    <p className="text-sm text-gray-500">
                      Queue ID: {history.queueId}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      history.status === "served"
                        ? "bg-green-100 text-green-700"
                        : history.status === "skipped"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {history.status}
                  </span>
                </div>

                {history.servedAt && (
                  <p className="text-sm text-gray-500 mt-3">
                    Date: {new Date(history.servedAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserHistory;

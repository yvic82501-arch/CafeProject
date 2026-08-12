import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

function Analytics() {
  const { queueId } = useParams();

  const [stats, setStats] = useState(null);
  const [waitTime, setWaitTime] = useState(null);
  const [peakHour, setPeakHour] = useState(null);

  const getAnalytics = async () => {
    try {
      const statsResponse = await api.get(`/queue/${queueId}/queueStat`);

      const waitResponse = await api.get(`/stat/${queueId}/wait-time`);

      const peakResponse = await api.get(`/stat/${queueId}/peak`);

      setStats(statsResponse.data.data);
      setWaitTime(waitResponse.data.data);
      setPeakHour(peakResponse.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAnalytics();
  }, [queueId]);

  return (
    <div className="min-h-screen bg-sky-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold">Queue Analytics</h1>
        <p className="text-gray-500 mt-1">View queue performance</p>
        <div className="grid md:grid-cols-3 gap-5 mt-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Users Served</p>
            <p className="text-3xl font-bold mt-2">{stats?.served || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Average Wait</p>
            <p className="text-3xl font-bold mt-2">
              {waitTime?.averageWait || 0}
            </p>
            <p className="text-sm text-gray-500">seconds</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Peak Hour</p>
            <h2 className="text-3xl font-bold">
              {peakHour?.peakHour || "No data"}
            </h2>
            <p className="text-gray-500">{peakHour?.users || 0} users</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow mt-6">
          <h2 className="text-xl font-bold mb-4">Queue Statistics</h2>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-3">
              <span>Total Users</span>
              <span className="font-bold">{stats?.total || 0}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span>Served Users</span>
              <span className="font-bold">{stats?.served || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Skipped Users</span>
              <span className="font-bold">{stats?.skipped || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;

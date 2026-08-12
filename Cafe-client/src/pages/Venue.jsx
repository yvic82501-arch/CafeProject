import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams } from "react-router-dom";

function Venue() {
  const { venueId } = useParams();

  const [queues, setQueues] = useState([]);

  const getQueues = async () => {
    try {
      const response = await api.get(`/queue/venue/${venueId}`);

      setQueues(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getQueues();
  }, [venueId]);

  return (
    <div className="bg-sky-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">Available Queues</h1>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {queues.map((queue) => (
            <div
              key={queue._id}
              className="bg-white p-6 rounded-xl hover:shadow-lg transition-shadow 300-ease-in-out"
            >
              <h2 className="text-xl font-semibold">{queue.name}</h2>
              <p className="mt-2 text-grey-600">
                Average Service Time: {queue.averageServiceTime}seconds
              </p>
              <p className="mt-2">
                Status:{" "}
                <span
                  className={queue.isActive ? "text-green-600" : "text-red-600"}
                >
                  {queue.isActive ? "Active" : "Inactive"}
                </span>
              </p>
              <a
                href={`/queue/${queue._id}`}
                className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg"
              >
                View Queue
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Venue;

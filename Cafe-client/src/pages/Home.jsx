import { useEffect, useState } from "react";
import api from "../api/api";
import VenueCard from "../components/VenueCard";

function Home() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const getVenue = async () => {
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
    getVenue();
  }, []);

  return (
    <div className="bg-sky-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">Find a Queue</h1>
        <p className="grid md:grid-cols-3 gap-6 mt-8">
          Select a venue and join queue remotely
        </p>
        {loading ? (
          <p className="mt-8">Loading venues...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mt-8 ">
            {venues.map((venue) => (
              <VenueCard key={venue._id} venue={venue}></VenueCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

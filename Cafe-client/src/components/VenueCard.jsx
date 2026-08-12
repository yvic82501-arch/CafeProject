import { Link } from "react-router-dom";

function VenueCard({ venue }) {
  return (
    <div className="bg-white rounded-xl hover:shadow-xl p-5 transition-shadow 300-ease-in-out">
      <h2 className="text-xl font-semibold">{venue.name}</h2>
      <p className="text-gray-500 mt-2">{venue.location}</p>
      <Link
        to={`/venue/${venue._id}`}
        className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow ease-in-out"
      >
        View Queues
      </Link>
    </div>
  );
}

export default VenueCard;

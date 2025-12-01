import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const trips = [
    {
      id: 1,
      title: "Trip to Paris",
      description: "Explore the city of love with guided tours and local experiences.",
      image: "https://source.unsplash.com/400x250/?paris",
      duration: "5 Days",
      price: "$1200"
    },
    {
      id: 2,
      title: "Mountain Hiking",
      description: "Adventure in the mountains with expert guides.",
      image: "https://source.unsplash.com/400x250/?mountain",
      duration: "3 Days",
      price: "$600"
    },
    {
      id: 3,
      title: "Beach Escape",
      description: "Relax on the sunny beaches with premium stay.",
      image: "https://source.unsplash.com/400x250/?beach",
      duration: "4 Days",
      price: "$800"
    },
  ];

  return (
    <div className="space-y-10">

      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-700">
          Welcome, {user?.name || "Traveler"}!
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Explore trips, create adventures, and find your travel buddy.
        </p>
        <button
          onClick={() => navigate("/dashboard/create-trip")}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Create a Trip
        </button>
      </div>

      {/* Trips Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer">
            <img src={trip.image} alt={trip.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
              <p className="text-gray-600 mb-4">{trip.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium">{trip.duration}</span>
                <span className="text-blue-600 font-bold">{trip.price}</span>
              </div>
              <button
                onClick={() => alert("Join Trip feature coming soon!")}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

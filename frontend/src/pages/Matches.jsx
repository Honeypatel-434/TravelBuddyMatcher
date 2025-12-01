import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Matches = () => {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interests, setInterests] = useState("");
  const [results, setResults] = useState([]);

  const search = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ destination, startDate, endDate, interests }).toString();
    const res = await fetch(`http://localhost:5000/api/matches?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setResults(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Find a Travel Buddy</h2>
      <form onSubmit={search} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white p-4 rounded shadow mb-6">
        <input className="border p-2 rounded" placeholder="Destination" value={destination} onChange={e=>setDestination(e.target.value)} />
        <input type="date" className="border p-2 rounded" value={startDate} onChange={e=>setStartDate(e.target.value)} />
        <input type="date" className="border p-2 rounded" value={endDate} onChange={e=>setEndDate(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Interests" value={interests} onChange={e=>setInterests(e.target.value)} />
        <button className="bg-blue-600 text-white rounded px-4">Search</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((r) => (
          <div key={r._id} className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold">{r.user?.name}</h3>
            <p className="text-gray-600">{r.destination} • {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}</p>
            <div className="mt-2 text-sm text-gray-500">Interests: {(r.interests||[]).join(', ')}</div>
            <button
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => {
                const otherId = typeof r.user === 'string' ? r.user : r.user?._id;
                const id = [user.id, otherId].filter(Boolean).sort().join('_');
                navigate(`/dashboard/messages/${id}`);
              }}
            >Message</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;

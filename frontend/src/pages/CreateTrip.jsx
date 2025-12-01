import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interests, setInterests] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        destination,
        startDate,
        endDate,
        interests: interests.split(',').map(s => s.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      navigate("/dashboard/home");
    } else {
      const data = await res.json();
      alert(data.message || "Failed to create trip");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Trip</h2>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full border p-3 rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="w-full border p-3 rounded" placeholder="Destination" value={destination} onChange={e=>setDestination(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <input type="date" className="w-full border p-3 rounded" value={startDate} onChange={e=>setStartDate(e.target.value)} />
          <input type="date" className="w-full border p-3 rounded" value={endDate} onChange={e=>setEndDate(e.target.value)} />
        </div>
        <input className="w-full border p-3 rounded" placeholder="Interests (comma separated)" value={interests} onChange={e=>setInterests(e.target.value)} />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded">Save Trip</button>
      </form>
    </div>
  );
};

export default CreateTrip;

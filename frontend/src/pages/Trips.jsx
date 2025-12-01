import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";

const Trips = () => {
  const { token, user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weatherByCity, setWeatherByCity] = useState({});
  const IN_CITIES = useMemo(() => new Set([
    "mumbai","delhi","bengaluru","bangalore","chennai","kolkata","hyderabad","pune","ahmedabad","jaipur","surat","lucknow","kanpur","nagpur","indore","thane","bhopal","visakhapatnam","patna","vadodara","ghaziabad","ludhiana","agra","nashik","faridabad","meerut","rajkot","kalyan","vasai","varanasi","srinagar","aurangabad","dhanbad","amritsar","navi mumbai","allahabad","prayagraj","ranchi","howrah","coimbatore","jabalpur","gwalior","vijayawada","madurai","guwahati","chandigarh","hubli","dharwad","mysore","tiruchirappalli","bareilly","aligarh","tiruppur","moradabad","jalandhar","bhubaneswar","salem","warangal","guntur","bikaner","noida","jamshedpur","bhiwandi","saharanpur","gorakhpur","bhilai","cuttack","firozabad","kochi","thiruvananthapuram","trivandrum","kozhikode","calicut","ernakulam","udaipur","ajmer","jodhpur","vellore","dehradun","shillong","imphal","itanagar","aizawl","gangtok","panaji","pondicherry","puducherry","kullu","manali","shimla","leh","kargil","rishikesh","haridwar","nainital","mussoorie","alleppey","munnar","ooty","kodaikanal","darjeeling","siliguri"
  ]), []);
  const normalizeCity = (name) => {
    const n = (name || "").trim().toLowerCase();
    const alias = { "bangalore": "bengaluru", "trivandrum": "thiruvananthapuram", "calicut": "kozhikode", "allahabad": "prayagraj" };
    return alias[n] || n;
  };

  const load = useCallback(async () => {
    const res = await fetch("http://localhost:5000/api/trips", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const mine = data.filter(t => t.user && t.user._id === user.id);
    setTrips(mine);
    setLoading(false);
  }, [token, user]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const fetchWeather = async () => {
      const uniqueCities = Array.from(new Set(trips.map(t => t.destination).filter(Boolean)));
      const updates = {};
      await Promise.all(uniqueCities.map(async (city) => {
        try {
          const c = normalizeCity(city);
          let res = await fetch(`http://localhost:5000/api/weather?city=${encodeURIComponent(c)}`);
          if (!res.ok && IN_CITIES.has(c)) {
            res = await fetch(`http://localhost:5000/api/weather?city=${encodeURIComponent(c)}&country=IN`);
          }
          if (res.ok) {
            const data = await res.json();
            updates[city] = data;
          }
        } catch (_) {}
      }));
      if (Object.keys(updates).length) setWeatherByCity(prev => ({ ...prev, ...updates }));
    };
    if (trips.length) fetchWeather();
  }, [trips, IN_CITIES]);

  const remove = async (id) => {
    const res = await fetch(`http://localhost:5000/api/trips/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setTrips(trips.filter(t => t._id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Trips</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trips.map((t) => (
          <div key={t._id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{t.title || t.destination}</h3>
              <button onClick={() => remove(t._id)} className="text-red-600">Delete</button>
            </div>
            <p className="text-gray-600">Destination: {t.destination}</p>
            <p className="text-gray-600">Dates: {new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}</p>
            <p className="text-gray-700">Weather: {weatherByCity[t.destination] ? `${Math.round(weatherByCity[t.destination].temp)}°C • ${weatherByCity[t.destination].condition}` : 'unavailable'}</p>
            <div className="mt-2 text-sm text-gray-500">Interests: {(t.interests||[]).join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trips;

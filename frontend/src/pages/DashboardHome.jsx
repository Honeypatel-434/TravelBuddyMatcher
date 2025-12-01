import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [upcoming, setUpcoming] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [homeWeather, setHomeWeather] = useState({});
  const IN_CITIES = useMemo(() => new Set([
    "mumbai","delhi","bengaluru","bangalore","chennai","kolkata","hyderabad","pune","ahmedabad","jaipur","surat","lucknow","kanpur","nagpur","indore","thane","bhopal","visakhapatnam","patna","vadodara","ghaziabad","ludhiana","agra","nashik","faridabad","meerut","rajkot","kalyan","vasai","varanasi","srinagar","aurangabad","dhanbad","amritsar","navi mumbai","allahabad","prayagraj","ranchi","howrah","coimbatore","jabalpur","gwalior","vijayawada","madurai","guwahati","chandigarh","hubli","dharwad","mysore","tiruchirappalli","bareilly","aligarh","tiruppur","moradabad","jalandhar","bhubaneswar","salem","warangal","guntur","bikaner","noida","jamshedpur","bhiwandi","saharanpur","gorakhpur","bhilai","cuttack","firozabad","kochi","thiruvananthapuram","trivandrum","kozhikode","calicut","ernakulam","udaipur","ajmer","jodhpur","vellore","dehradun","shillong","imphal","itanagar","aizawl","gangtok","panaji","pondicherry","puducherry","kullu","manali","shimla","leh","kargil","rishikesh","haridwar","nainital","mussoorie","alleppey","munnar","ooty","kodaikanal","darjeeling","siliguri"
  ]), []);
  const normalizeCity = (name) => {
    const n = (name || "").trim().toLowerCase();
    const alias = { "bangalore": "bengaluru", "trivandrum": "thiruvananthapuram", "calicut": "kozhikode", "allahabad": "prayagraj" };
    return alias[n] || n;
  };

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:5000/api/trips", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const mine = data.filter(t => t.user && (t.user._id === user.id));
      const now = new Date();
      const upcomingTrips = mine.filter(t => new Date(t.endDate) >= now)
        .sort((a,b) => new Date(a.startDate) - new Date(b.startDate));
      setUpcoming(upcomingTrips);

      const baseTrip = upcomingTrips[0] || mine.sort((a,b) => new Date(b.startDate) - new Date(a.startDate))[0];
      if (baseTrip) {
        const params = new URLSearchParams({
          destination: baseTrip.destination || "",
          startDate: baseTrip.startDate,
          endDate: baseTrip.endDate,
          interests: (baseTrip.interests||[]).join(',')
        }).toString();
        const mres = await fetch(`http://localhost:5000/api/matches?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const matches = await mres.json();
        const filtered = matches.filter(t => {
          const uid = typeof t.user === 'string' ? t.user : t.user?._id;
          return uid && uid !== user.id;
        });
        const byUser = new Map();
        filtered.forEach(t => {
          const uid = typeof t.user === 'string' ? t.user : t.user?._id;
          if (uid && !byUser.has(uid)) byUser.set(uid, t);
        });
        setSuggested(Array.from(byUser.values()).slice(0,6));
      } else {
        setSuggested([]);
      }
    };
    if (token && user) load();
  }, [token, user]);

  useEffect(() => {
    const fetchWeather = async () => {
      const cities = Array.from(new Set(upcoming.map(u => u.destination).filter(Boolean)));
      const updates = {};
      await Promise.all(cities.map(async (city) => {
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
      if (Object.keys(updates).length) setHomeWeather(prev => ({ ...prev, ...updates }));
    };
    if (upcoming.length) fetchWeather();
  }, [upcoming, IN_CITIES]);

  return (
    <div className="space-y-12">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-10 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold mb-3">Welcome back, {user?.name || "Traveler"} ✈️</h1>
        <p className="text-lg opacity-90">
          Plan your journeys, find perfect travel buddies, and explore the world with confidence.
        </p>

        <button onClick={() => navigate("/dashboard/create-trip")} className="mt-5 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition">
          Create Your Next Trip
        </button>
      </section>

      {/* QUICK ACTIONS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <button onClick={() => navigate("/dashboard/create-trip")} className="text-left bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">✈️ Create a Trip</h3>
            <p className="text-gray-600">Plan destination, dates & preferences.</p>
          </button>

          <button onClick={() => navigate("/dashboard/find-buddy")} className="text-left bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">🤝 Find a Buddy</h3>
            <p className="text-gray-600">Match based on interests and travel plans.</p>
          </button>

          <button onClick={() => navigate("/dashboard/messages")} className="text-left bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">💬 Messages</h3>
            <p className="text-gray-600">Chat with your matched partners.</p>
          </button>

        </div>
      </section>

      {/* UPCOMING TRIPS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Upcoming Trips</h2>

        {upcoming.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">No trips yet. Start by creating one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {upcoming.map((t) => (
              <div key={t._id} className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-semibold">{t.title || t.destination}</h3>
                <p className="text-gray-600">{t.destination}</p>
                <p className="text-gray-600">{new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}</p>
                <div className="mt-1 text-gray-700">Weather: {homeWeather[t.destination] ? `${Math.round(homeWeather[t.destination].temp)}°C • ${homeWeather[t.destination].condition}` : 'unavailable'}</div>
                <div className="mt-2 text-sm text-gray-500">Interests: {(t.interests||[]).join(', ')}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SUGGESTED BUDDIES */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Suggested Travel Buddies</h2>
        {suggested.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">No suggestions yet. Create a trip or adjust your preferences.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {suggested.map((s) => (
              <div key={s._id} className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-semibold">{s.user?.name}</h3>
                <p className="text-gray-600">{s.destination}</p>
                <div className="mt-2 text-sm text-gray-500">Interests: {(s.interests||[]).join(', ')}</div>
                <button onClick={() => {
                  const otherId = typeof s.user === 'string' ? s.user : s.user?._id;
                  const id = [user.id, otherId].filter(Boolean).sort().join('_');
                  navigate(`/dashboard/messages/${id}`);
                }} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Message</button>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default DashboardHome;

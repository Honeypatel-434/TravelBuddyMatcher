import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { token, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", bio: "", interests: "", travelStyle: "", budgetRange: "" });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:5000/api/protected/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const u = await res.json();
      setForm({
        name: u.name || "",
        bio: u.bio || "",
        interests: (u.interests || []).join(', '),
        travelStyle: u.travelStyle || "",
        budgetRange: u.budgetRange || "",
      });
      setLoading(false);
    };
    if (token) load();
  }, [token]);

  const update = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      bio: form.bio,
      interests: form.interests.split(',').map(s => s.trim()).filter(Boolean),
      travelStyle: form.travelStyle,
      budgetRange: form.budgetRange,
    };
    const res = await fetch("http://localhost:5000/api/protected/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const updated = await res.json();
      setUser({ id: updated._id, name: updated.name, email: updated.email });
      alert("Profile updated");
      setEditing(false);
    } else {
      const data = await res.json();
      alert(data.message || "Update failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {editing ? (
        <form onSubmit={update} className="space-y-4">
          <input className="w-full border p-3 rounded" placeholder="Name" value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} />
          <textarea className="w-full border p-3 rounded" placeholder="Bio" value={form.bio} onChange={e=>setForm({ ...form, bio: e.target.value })} />
          <input className="w-full border p-3 rounded" placeholder="Interests (comma separated)" value={form.interests} onChange={e=>setForm({ ...form, interests: e.target.value })} />
          <input className="w-full border p-3 rounded" placeholder="Travel Style (e.g., Adventure)" value={form.travelStyle} onChange={e=>setForm({ ...form, travelStyle: e.target.value })} />
          <input className="w-full border p-3 rounded" placeholder="Budget Range (e.g., ₹₹)" value={form.budgetRange} onChange={e=>setForm({ ...form, budgetRange: e.target.value })} />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500">Name</div>
            <div className="font-medium">{form.name || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Bio</div>
            <div>{form.bio || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Interests</div>
            <div>{form.interests || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Travel Style</div>
            <div>{form.travelStyle || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Budget Range</div>
            <div>{form.budgetRange ? `₹ ${form.budgetRange}` : "-"}</div>
          </div>
          <button onClick={()=>setEditing(true)} className="bg-gray-800 text-white px-4 py-2 rounded">Edit</button>
        </div>
      )}
    </div>
  );
};

export default Profile;

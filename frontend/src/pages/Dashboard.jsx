import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const DashboardLayout = () => {
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const logout = () => { setUser(null); setToken(null); navigate('/login'); };
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">TravelBuddy</h1>

        <div className="flex gap-6 text-gray-700 font-medium items-center">
          <Link to="/dashboard/home" className="hover:text-blue-600">Home</Link>
          <Link to="/dashboard/create-trip" className="hover:text-blue-600">Create Trip</Link>
          <Link to="/dashboard/my-trips" className="hover:text-blue-600">My Trips</Link>
          <Link to="/dashboard/find-buddy" className="hover:text-blue-600">Find Buddy</Link>
          <Link to="/dashboard/messages" className="hover:text-blue-600">Messages</Link>
          <Link to="/dashboard/profile" className="hover:text-blue-600">Profile</Link>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
        </div>
      </nav>

      {/* Main Page Content */}
      <div className="p-8">
        <Outlet />
      </div>

    </div>
  );
};

export default DashboardLayout;

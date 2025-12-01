import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Trips from "./pages/Trips";
import CreateTrip from "./pages/CreateTrip";
import DashboardHome from "./pages/DashboardHome";
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";

function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>}>

          {/* Nested Pages inside Dashboard */}
          <Route path="home" element={<DashboardHome />} />
          <Route path="my-trips" element={<Trips />} />
          <Route path="create-trip" element={<CreateTrip />} />
          <Route path="find-buddy" element={<Matches />} />
          <Route path="messages" element={<Chat />} />
          <Route path="messages/:roomId" element={<Chat />} />
          <Route path="profile" element={<Profile />} />

          {/* Default Dashboard route */}
          <Route index element={<Navigate to="home" />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

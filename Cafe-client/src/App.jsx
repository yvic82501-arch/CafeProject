import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Venue from "./pages/Venue";
import Queue from "./pages/Queue";
import Login from "./pages/Login";
import QueueStatus from "./pages/QueueStatus";
import AdminDashboard from "./pages/AdminDashboard";
import AdminQueue from "./pages/AdminQueue";
import ProtectedRoute from "./components/ProtectedRoute";
import Analytics from "./pages/Analytics";
import UserHistory from "./pages/UserHistory";
import UserRoute from "./components/UserRoute";
import Register from "./pages/Register";
import QueueControl from "./pages/QueueControl";
import DashboardStats from "./pages/DashboardStat";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venue/:venueId" element={<Venue />} />
        <Route path="/queue/:queueId" element={<Queue />} />
        <Route path="/login" element={<Login />} />
        <Route path="/status/:queueId" element={<QueueStatus />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/queue/:queueId"
          element={
            <ProtectedRoute>
              <AdminQueue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/queue/:queueId/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <UserRoute>
              <UserHistory />
            </UserRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin/add-queue"
          element={
            <ProtectedRoute>
              <QueueControl />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dash-stat"
          element={
            <ProtectedRoute>
              <DashboardStats />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

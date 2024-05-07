import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Components/LogIn/Login";
import { getUser } from "./JS/actions/useraction";
import StudentDashboard from "./Components/Dashboard/StudentDashboard";
import TeacherDashboard from "./Components/Dashboard/TeacherDashboard";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import PrivateRoute from "./Components";
import { io } from "socket.io-client";
import { updateNotification } from "./JS/actions/notificationactions";

function App() {
  const currentUser = useSelector((state) => state.userR.currentUser);
  const socketNotifications = useSelector(
    (state) => state.notificationR.socketNotifications
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    // Set up Socket.IO connection
    const socket = io("http://localhost:4500"); // Replace with your server URL
    // Add event listener for incoming notifications
    socket.on("notification", (notification) => {
      dispatch(updateNotification(notification));
    });

    // Emit each notification from socketNotifications array
    socketNotifications.forEach((notification) => {
      socket.emit("sendNotification", notification);
    });

    return () => {
      // Clean up socket connection on component unmount
      socket.disconnect();
    };
  }, [dispatch, socketNotifications]); // Ensure dispatch and socketNotifications are added as dependencies

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            {currentUser?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )}
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher"
        element={
          <PrivateRoute>
            {currentUser?.role === "teacher" ? (
              <TeacherDashboard />
            ) : (
              <Navigate to="/login" />
            )}
          </PrivateRoute>
        }
      />
      <Route
        path="/student"
        element={
          <PrivateRoute>
            {currentUser?.role === "student" ? (
              <StudentDashboard />
            ) : (
              <Navigate to="/login" />
            )}
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;

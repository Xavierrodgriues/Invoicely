// App.jsx
import AuthForm from "./Pages/Auth/AuthForm";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./Component/ProtectedRoute/ProtectedRoute";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Profile from "./Pages/Dashboard/Profile";
import Invoice from "./Pages/Dashboard/Invoice";
import ViewAll from "./Pages/Dashboard/ViewAll";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Login page */}
        <Route path="/" element={<AuthForm />} />

        {/* Dashboard with nested routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested route for profile */}
          <Route path="profile" element={<Profile />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="view-all" element={<ViewAll />} />
          {/* You can add more nested routes here */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
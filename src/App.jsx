import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UserPage from "./pages/UserPage";
import RaiseComplaint from "./pages/RaiseComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import ResolvedComplaints from "./pages/ResolvedComplaints";

function LayoutWrapper({ children }) {
  const location = useLocation();

  // Routes where Header & Footer should be hidden
  const hiddenRoutes = ["/signup", "/login", "/admin/login"];

  // Hide layout if pathname matches any hidden route
  // or starts with /user/
  const hideLayout =
    hiddenRoutes.includes(location.pathname) || location.pathname.startsWith("/user/");

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header />}
      <main className="flex-grow">{children}</main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/user/:userId" element={<UserPage />} />
          <Route path="/user/:userId/raise" element={<RaiseComplaint />} />
          <Route path="/user/:userId/track" element={<TrackComplaint />} />
          <Route path="/user/:userId/resolved" element={<ResolvedComplaints />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
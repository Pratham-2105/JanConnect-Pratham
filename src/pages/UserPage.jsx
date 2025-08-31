import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Menu,
  X,
  AlertCircle,
  Search,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { Globe3D } from "../components/Globe3D";
import LionComponent from "../pages/LionComponent";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedAuthority, setSelectedAuthority] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [visibleComplaints, setVisibleComplaints] = useState(5);
  const [activeChartTab, setActiveChartTab] = useState("department");

  // Sample data for dropdowns
  const states = ["California", "Texas", "New York", "Florida", "Illinois"];

  const authorities = {
    California: ["Los Angeles Police", "San Francisco PD", "San Diego Sheriff"],
    Texas: ["Houston Police", "Dallas PD", "Austin Sheriff"],
    NewYork: ["NYPD", "Albany Police", "Buffalo PD"],
    Florida: ["Miami Police", "Orlando PD", "Tampa Sheriff"],
    Illinois: ["Chicago Police", "Springfield PD", "Peoria Sheriff"],
  };

  const trendingComplaints = [
  { id: 1, area: "Mumbai", title: "Water supply issue in Andheri", reports: 245, severity: "High", time: "2 hours ago", lat: 34.05, lon: -218.24 },
  { id: 2, area: "Delhi", title: "Street lights not functioning in Connaught Place", reports: 189, severity: "Medium", time: "5 hours ago", lat: 32.78, lon: -96.8 },
  { id: 3, area: "Bengaluru", title: "Garbage collection delays in Whitefield", reports: 167, severity: "High", time: "1 day ago", lat: 40.71, lon: 374.01 },
  { id: 4, area: "Hyderabad", title: "Potholes causing traffic jams in Hitech City", reports: 142, severity: "Medium", time: "1 day ago", lat: 10.71, lon: 74.01 },
  { id: 5, area: "Kolkata", title: "Drainage blockage near Salt Lake", reports: 128, severity: "High", time: "2 days ago", lat: -30.71, lon: -84.01 },
  { id: 6, area: "Chennai", title: "Frequent power cuts in T Nagar", reports: 115, severity: "Medium", time: "2 days ago", lat: -30.71, lon: 184.01 },
  { id: 7, area: "Pune", title: "Illegal parking on main roads", reports: 98, severity: "Low", time: "3 days ago", lat: 18.52, lon: 73.85 },
  { id: 8, area: "Ahmedabad", title: "Mosquito menace in residential areas", reports: 87, severity: "Medium", time: "3 days ago", lat: 23.02, lon: 72.57 },
  { id: 9, area: "Jaipur", title: "Water logging during rains", reports: 76, severity: "High", time: "4 days ago", lat: 26.91, lon: 75.79 },
  { id: 10, area: "Lucknow", title: "Stray animal problem in colonies", reports: 65, severity: "Low", time: "4 days ago", lat: 26.85, lon: 80.95 }
];

const departmentPerformanceData = [
  { department: "Water Department", resolved: 85, pending: 15, avgTime: "2.3 days" },
  { department: "Electricity Board", resolved: 72, pending: 28, avgTime: "3.1 days" },
  { department: "Municipal Corp", resolved: 68, pending: 32, avgTime: "4.2 days" },
  { department: "Public Works", resolved: 91, pending: 9, avgTime: "1.8 days" },
  { department: "Sanitation", resolved: 78, pending: 22, avgTime: "2.7 days" },
  { department: "Traffic Police", resolved: 64, pending: 36, avgTime: "5.5 days" }
];
  const reportsOverTimeData = [
    { month: "Jan", reports: 45, resolved: 32 },
    { month: "Feb", reports: 52, resolved: 38 },
    { month: "Mar", reports: 48, resolved: 42 },
    { month: "Apr", reports: 67, resolved: 51 },
    { month: "May", reports: 73, resolved: 58 },
    { month: "Jun", reports: 89, resolved: 72 },
    { month: "Jul", reports: 95, resolved: 76 },
    { month: "Aug", reports: 112, resolved: 89 },
    { month: "Sep", reports: 98, resolved: 82 },
    { month: "Oct", reports: 84, resolved: 71 },
    { month: "Nov", reports: 76, resolved: 64 },
    { month: "Dec", reports: 63, resolved: 54 },
  ];
  const sortedComplaints = useMemo(() => {
    const severityOrder = { High: 0, Medium: 1, Low: 2 };
    return [...trendingComplaints].sort((a, b) => {
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      if (!storedUser || storedUser === "undefined" || storedUser === "null") {
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }

    // Animation trigger
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Detect scroll for header style changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const handleCardClick = (cardIndex) => {
    setActiveCard(activeCard === cardIndex ? null : cardIndex);
  };

  const navigateToRaiseComplaint = () => {
    if (user && user._id) {
      navigate(`/user/${user._id}/raise`);
    }
  };

  const navigateToTrackComplaint = () => {
    if (user && user._id) {
      navigate(`/user/${user._id}/track`);
    }
  };

  const navigateToResolvedComplaints = () => {
    if (user && user._id) {
      navigate(`/user/${user._id}/resolved`);
    }
  };

  const loadMoreComplaints = () => {
    setVisibleComplaints((prev) => Math.min(prev + 5, sortedComplaints.length));
  };

  const showLessComplaints = () => {
    setVisibleComplaints(5);
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/40";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/40";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/40";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <p className="font-bold text-white text-sm mb-4 border-b border-white/10 pb-2 text-shadow-sm">
            {label}
          </p>
          <div className="space-y-5 ounded-xl">
            {/* Resolved */}
            <div className="flex justify-between items-center">
              <span className="text-green-300 text-sm text-shadow-sm">
                Resolved
              </span>
              <span className="text-white font-semibold text-shadow-sm">
                {data.resolved}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-[0_0_20px_rgba(16,185,129,0.7)] transition-all duration-500"
                style={{ width: `${data.resolved}%` }}
              />
            </div>

            {/* Pending */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-yellow-300 text-sm text-shadow-sm">
                Pending
              </span>
              <span className="text-white font-semibold text-shadow-sm">
                {data.pending}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all duration-500"
                style={{ width: `${data.pending}%` }}
              />
            </div>

            {/* Avg Time */}
            <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/10">
              <span className="text-blue-300 text-sm text-shadow-sm">
                Avg. Time
              </span>
              <span className="text-white font-semibold text-shadow-sm">
                {data.avgTime}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for reports over time chart
  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] p-4 flex flex-col space-y-2">
          <p className="text-white font-bold text-sm text-shadow-md">{label}</p>
          <p className="text-blue-400 text-sm text-shadow-sm">
            Reports: {payload[0].value}
          </p>
          <p className="text-green-400 text-sm text-shadow-sm">
            Resolved: {payload[1].value}
          </p>
          <p className="text-gray-300 text-sm">
            Resolution Rate:{" "}
            <span className="font-semibold text-white text-shadow-sm">
              {payload[0].value
                ? Math.round((payload[1].value / payload[0].value) * 100)
                : 0}
              %
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/userloginbg6.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/userloginbg6.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>
      {/* Header at the very top - matching the provided design */}
<motion.header
  className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
    isScrolled
      ? "backdrop-blur-lg shadow-sm"
      : "backdrop-blur-md"
  }`}
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  transition={{ type: "spring", damping: 20, stiffness: 300 }}
>
  <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
    {/* Site Name */}
    <motion.div
      className="text-xl md:text-2xl font-bold text-white"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      JanConnect
    </motion.div>

    {/* Desktop Navigation Items */}
    <div className="hidden md:flex items-center space-x-4">
      {/* State Dropdown */}
      <div className="relative">
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedAuthority("");
          }}
          className="p-2 bg-white-900/70 backdrop-blur-sm rounded-xl border border-white/20 text-white focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 shadow-sm"
        >
          <option value="" className="bg-white-800/90 text-white">
            Select Your State
          </option>
          {states.map((state) => (
            <option
              key={state}
              value={state}
              className="bg-white-800/90 text-white"
            >
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Authority Dropdown */}
      <div className="relative">
        <select
          value={selectedAuthority}
          onChange={(e) => setSelectedAuthority(e.target.value)}
          disabled={!selectedState}
          className="p-2 bg-white-900/70 backdrop-blur-sm rounded-xl border border-white/20 text-white focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="" className="bg-white-800/90 text-white">
            Select Your Authority
          </option>
          {selectedState &&
            authorities[selectedState.replace(/\s+/g, "")]?.map(
              (auth) => (
                <option
                  key={auth}
                  value={auth}
                  className="bg-white-800/90 text-white"
                >
                  {auth}
                </option>
              )
            )}
        </select>
      </div>

      {/* Profile Section */}
      <div className="relative">
        <motion.button
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          className="flex items-center space-x-2 bg-white-900/70 hover:bg-white-800/70 p-2 pl-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-white/20 backdrop-blur-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-white">Welcome, {user.name}</span>
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </motion.button>

        {/* Profile Dropdown */}
        <AnimatePresence>
          {showProfileDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 bg-white-900/95 backdrop-blur-xl rounded-xl shadow-lg z-20 overflow-hidden border border-white/20"
            >
              <div className="p-4 border-b border-white/10">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-white/60 text-sm">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left p-4 text-white/90 hover:bg-red-500/20 transition-all duration-150 flex items-center"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

    {/* Mobile Menu Button */}
    <motion.button
      className="md:hidden p-2 rounded-xl bg-white/0 hover:bg-white/10 transition-colors duration-300"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle menu"
    >
      {mobileMenuOpen ? (
        <i className="fas fa-times h-6 w-6 text-white"></i>
      ) : (
        <i className="fas fa-bars h-6 w-6 text-white"></i>
      )}
    </motion.button>
  </div>
</motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/20 backdrop-blur-lg md:hidden overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {/* State Dropdown in Mobile Menu */}
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedAuthority("");
                  }}
                  className="w-full p-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-gray-800 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 shadow-sm"
                >
                  <option value="" className="bg-white-800/90 text-white">
                    Select Your State
                  </option>
                  {states.map((state) => (
                    <option
                      key={state}
                      value={state}
                      className="bg-white-800/90 text-white"
                    >
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Authority Dropdown in Mobile Menu */}
              <div className="relative">
                <select
                  value={selectedAuthority}
                  onChange={(e) => setSelectedAuthority(e.target.value)}
                  disabled={!selectedState}
                  className="w-full p-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-gray-800 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" className="bg-white-800/90 text-white">
                    Select Your Authority
                  </option>
                  {selectedState &&
                    authorities[selectedState.replace(/\s+/g, "")]?.map(
                      (auth) => (
                        <option
                          key={auth}
                          value={auth}
                          className="bg-white-800/90 text-white"
                        >
                          {auth}
                        </option>
                      )
                    )}
                </select>
              </div>

              {/* Profile Info in Mobile Menu */}
              <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20">
                <p className="text-white-800 font-medium">{user.name}</p>
                <p className="text-white-800/60 text-sm">{user.email}</p>
              </div>

              {/* Logout Button in Mobile Menu */}
              <motion.button
                className="flex items-center justify-center space-x-1 px-4 py-2 rounded-xl border border-white text-gray-800 bg-transparent hover:bg-white/10 transition-all duration-300"
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto mt-16 gap-6 px-4">
        {/* Welcome Text */}
        <motion.div
          className={`flex-1 text-left transition-all duration-700 delay-400 ease-out ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, {user.name} 🎉
          </h1>
          <p className="text-white/70 text-lg">
            Press and drag to blow the wind .The lion will surely appreciate.
          </p>
        </motion.div>

        {/* Lion Component */}
        <div className="flex-1 w-full h-96 md:h-80">
          <LionComponent />
        </div>
      </div>
      {/* Main Content Area - Globe on left, Trending complaints on right */}
      <div className="flex-1 flex flex-col lg:flex-row mt-20 p-4 relative z-10 gap-6">
        {/* Left Section - Globe */}
        <div className="w-full lg:w-1/2 h-96 lg:h-auto">
          <Globe3D complaints={sortedComplaints.slice(0, 6)} />
        </div>

        {/* Right Section - Trending Complaints */}
        <div className="w-full lg:w-1/2 backdrop-blur-md rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Trending Complaints
            </h2>
            <div className="flex items-center text-white/60 text-sm">
              <Users className="h-4 w-4 mr-1" />
              <span>{sortedComplaints.length} total reports</span>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {sortedComplaints
              .slice(0, visibleComplaints)
              .map((complaint, index) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 text-blue-400 mr-2" />
                        <span className="text-white font-medium">
                          {complaint.area}
                        </span>
                        <span
                          className={`ml-3 px-2 py-1 rounded-full text-xs border ${getSeverityColor(
                            complaint.severity
                          )}`}
                        >
                          {getSeverityIcon(complaint.severity)}{" "}
                          {complaint.severity}
                        </span>
                      </div>
                      <h3 className="text-white text-sm font-semibold mb-2">
                        {complaint.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{complaint.reports} reports</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{complaint.time}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/40 ml-2 mt-1" />
                  </div>
                </motion.div>
              ))}
          </div>

          {sortedComplaints.length > 5 && (
            <div className="mt-6 flex justify-center">
              {visibleComplaints < sortedComplaints.length ? (
                <motion.button
                  onClick={loadMoreComplaints}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/40 text-white rounded-full border border-indigo-500/50 transition-all duration-300"
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Load More ({sortedComplaints.length - visibleComplaints}{" "}
                  remaining)
                </motion.button>
              ) : (
                <motion.button
                  onClick={showLessComplaints}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-gray-600/30 hover:bg-gray-600/40 text-white rounded-full border border-gray-500/50 transition-all duration-300"
                >
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show Less
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="w-full p-4 mt-8 relative z-10">
        <div className=" backdrop-blur-md rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Performance Analytics
            </h2>
            <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-xl p-1">
              <button
                onClick={() => setActiveChartTab("department")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center ${
                  activeChartTab === "department"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-transparent text-white/70 hover:bg-white/10"
                }`}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Department Performance
              </button>
              <button
                onClick={() => setActiveChartTab("reports")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center ${
                  activeChartTab === "reports"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-transparent text-white/70 hover:bg-white/10"
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Reports Timeline
              </button>
            </div>
          </div>

          <div className="h-80">
            {activeChartTab === "department" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentPerformanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  barSize={35}
                >
                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient
                      id="resolvedGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#34D399" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#10B981"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                    <linearGradient
                      id="pendingGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#FDE68A" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#F59E0B"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="department"
                    // angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{
                      fill: "rgba(255,255,255,0.8)",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12 }}
                    label={{
                      value: "Resolution Rate (%)",
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        fill: "rgba(255,255,255,0.8)",
                        fontSize: 12,
                        fontWeight: 500,
                      },
                    }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    content={<CustomBarTooltip />}
                    cursor={{ fill: "rgba(255,255,255,0.1)" }}
                  />

                  {/* Bars with gradient */}
                  <Bar
                    dataKey="resolved"
                    name="Resolved"
                    fill="url(#resolvedGradient)"
                    radius={[6, 6, 0, 0]}
                    background={{ fill: "rgba(255,255,255,0.05)", radius: 6 }}
                  />
                  <Bar
                    dataKey="pending"
                    name="Pending"
                    fill="url(#pendingGradient)"
                    radius={[6, 6, 0, 0]}
                    background={{ fill: "rgba(255,255,255,0.05)", radius: 6 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={reportsOverTimeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.7)" }} />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Legend
                    wrapperStyle={{
                      color: "rgba(255,255,255,0.7)",
                      paddingTop: "20px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reports"
                    name="Total Reports"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#3B82F6" }}
                    activeDot={{ r: 6, fill: "#3B82F6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    name="Resolved Cases"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#10B981" }}
                    activeDot={{ r: 6, fill: "#10B981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Three Interactive Cards Section */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 mt-8">
        <div className="w-full max-w-6xl">

          {/* Three Interactive Cards */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 px-4">
            {/* Raise a Complaint Card */}
            <motion.div
              className={`w-full md:w-72 h-80 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer flex flex-col items-center justify-center ${
                activeCard === 0 ? "z-30" : "z-10"
              }`}
              onClick={() => handleCardClick(0)}
              animate={{
                scale: activeCard === 0 ? 1.1 : 1,
                rotateY: activeCard === 0 ? 0 : activeCard !== null ? 10 : 0,
                x:
                  activeCard === 0
                    ? 0
                    : activeCard === 1
                    ? -40
                    : activeCard === 2
                    ? 40
                    : 0,
                y: activeCard === 0 ? -20 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mb-5">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Raise a Complaint
              </h3>
              <p className="text-white/80 text-center text-sm">
                Report issues and problems in your community that need attention
                from authorities.
              </p>
              <motion.button
                className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium"
                animate={{ scale: activeCard === 0 ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={navigateToRaiseComplaint}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Report Now
              </motion.button>
            </motion.div>

            {/* Track Your Complaint Card */}
            <motion.div
              className={`w-full md:w-72 h-80 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer flex flex-col items-center justify-center ${
                activeCard === 1 ? "z-30" : "z-10"
              }`}
              onClick={() => handleCardClick(1)}
              animate={{
                scale: activeCard === 1 ? 1.1 : 1,
                rotateY: activeCard === 1 ? 0 : activeCard !== null ? 10 : 0,
                x:
                  activeCard === 1
                    ? 0
                    : activeCard === 0
                    ? 40
                    : activeCard === 2
                    ? -40
                    : 0,
                y: activeCard === 1 ? -20 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mb-5">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Track Your Complaint
              </h3>
              <p className="text-white/80 text-center text-sm">
                Monitor the status of your submitted complaints and see the
                progress being made.
              </p>
              <motion.button
                className="mt-6 bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-medium"
                animate={{ scale: activeCard === 1 ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={navigateToTrackComplaint}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Check Status
              </motion.button>
            </motion.div>

            {/* Resolved Complaints Card */}
            <motion.div
              className={`w-full md:w-72 h-80 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer flex flex-col items-center justify-center ${
                activeCard === 2 ? "z-30" : "z-10"
              }`}
              onClick={() => handleCardClick(2)}
              animate={{
                scale: activeCard === 2 ? 1.1 : 1,
                rotateY: activeCard === 2 ? 0 : activeCard !== null ? 10 : 0,
                x:
                  activeCard === 2
                    ? 0
                    : activeCard === 0
                    ? -40
                    : activeCard === 1
                    ? 40
                    : 0,
                y: activeCard === 2 ? -20 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-5">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Resolved Complaints
              </h3>
              <p className="text-white/80 text-center text-sm">
                View your previously resolved complaints and see how your
                reports made a difference.
              </p>
              <motion.button
                className="mt-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium"
                animate={{ scale: activeCard === 2 ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={navigateToResolvedComplaints}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View History
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        select option {
          background: rgba(30, 41, 59, 0.95);
          color: white;
          padding: 10px;
        }
        /* Custom scrollbar for trending complaints */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, X, AlertCircle, Search, CheckCircle } from "lucide-react";

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

  // Sample data for dropdowns
  const states = [
    "California", "Texas", "New York", "Florida", "Illinois"
  ];
  
  const authorities = {
    California: ["Los Angeles Police", "San Francisco PD", "San Diego Sheriff"],
    Texas: ["Houston Police", "Dallas PD", "Austin Sheriff"],
    NewYork: ["NYPD", "Albany Police", "Buffalo PD"],
    Florida: ["Miami Police", "Orlando PD", "Tampa Sheriff"],
    Illinois: ["Chicago Police", "Springfield PD", "Peoria Sheriff"]
  };

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

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/userpagebg.jpg')" }}
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
      {/* Background matching the login page exactly */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/userpagebg.jpg')" }}
        ></div>
        {/* Exact same glassmorphism overlay as login page */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* Header at the very top - matching the provided design */}
      <motion.header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/20 backdrop-blur-lg shadow-sm" 
            : "bg-white/10 backdrop-blur-md"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Site Name */}
          <motion.div 
            className="text-xl md:text-2xl font-bold text-gray-800"
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
                className="p-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-gray-800 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 shadow-sm"
              >
                <option value="" className="bg-gray-800/90 text-white">Select Your State</option>
                {states.map((state) => (
                  <option key={state} value={state} className="bg-gray-800/90 text-white">{state}</option>
                ))}
              </select>
            </div>
            
            {/* Authority Dropdown */}
            <div className="relative">
              <select 
                value={selectedAuthority} 
                onChange={(e) => setSelectedAuthority(e.target.value)}
                disabled={!selectedState}
                className="p-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-gray-800 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-gray-800/90 text-white">Select Your Authority</option>
                {selectedState && authorities[selectedState.replace(/\s+/g, '')]?.map((auth) => (
                  <option key={auth} value={auth} className="bg-gray-800/90 text-white">{auth}</option>
                ))}
              </select>
            </div>

            {/* Profile Section */}
            <div className="relative">
              <motion.button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 p-2 pl-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-white/20 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-gray-800">Welcome, {user.name}</span>
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
                    className="absolute right-0 mt-2 w-56 bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg z-20 overflow-hidden border border-white/20"
                  >
                    <div className="p-4 border-b border-white/10">
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-white/60 text-sm">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left p-4 text-white/90 hover:bg-red-500/20 transition-all duration-150 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
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
              <X className="h-6 w-6 text-gray-800" />
            ) : (
              <Menu className="h-6 w-6 text-gray-800" />
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
                  <option value="" className="bg-gray-800/90 text-white">Select Your State</option>
                  {states.map((state) => (
                    <option key={state} value={state} className="bg-gray-800/90 text-white">{state}</option>
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
                  <option value="" className="bg-gray-800/90 text-white">Select Your Authority</option>
                  {selectedState && authorities[selectedState.replace(/\s+/g, '')]?.map((auth) => (
                    <option key={auth} value={auth} className="bg-gray-800/90 text-white">{auth}</option>
                  ))}
                </select>
              </div>

              {/* Profile Info in Mobile Menu */}
              <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20">
                <p className="text-gray-800 font-medium">{user.name}</p>
                <p className="text-gray-800/60 text-sm">{user.email}</p>
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

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 mt-16">
        <div className="w-full max-w-6xl">
          {/* Welcome Message */}
          <motion.div 
            className={`text-center mb-10 transition-all duration-700 delay-400 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user.name} 🎉</h1>
            <p className="text-white/70 text-lg">We're glad to have you back.</p>
          </motion.div>

          {/* Three Interactive Cards */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 px-4">
            {/* Raise a Complaint Card */}
            <motion.div
              className={`w-full md:w-72 h-80 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer flex flex-col items-center justify-center ${
                activeCard === 0 ? 'z-30' : 'z-10'
              }`}
              onClick={() => handleCardClick(0)}
              animate={{
                scale: activeCard === 0 ? 1.1 : 1,
                rotateY: activeCard === 0 ? 0 : activeCard !== null ? 10 : 0,
                x: activeCard === 0 ? 0 : activeCard === 1 ? -40 : activeCard === 2 ? 40 : 0,
                y: activeCard === 0 ? -20 : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mb-5">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Raise a Complaint</h3>
              <p className="text-white/80 text-center text-sm">
                Report issues and problems in your community that need attention from authorities.
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
                activeCard === 1 ? 'z-30' : 'z-10'
              }`}
              onClick={() => handleCardClick(1)}
              animate={{
                scale: activeCard === 1 ? 1.1 : 1,
                rotateY: activeCard === 1 ? 0 : activeCard !== null ? 10 : 0,
                x: activeCard === 1 ? 0 : activeCard === 0 ? 40 : activeCard === 2 ? -40 : 0,
                y: activeCard === 1 ? -20 : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mb-5">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Track Your Complaint</h3>
              <p className="text-white/80 text-center text-sm">
                Monitor the status of your submitted complaints and see the progress being made.
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
                activeCard === 2 ? 'z-30' : 'z-10'
              }`}
              onClick={() => handleCardClick(2)}
              animate={{
                scale: activeCard === 2 ? 1.1 : 1,
                rotateY: activeCard === 2 ? 0 : activeCard !== null ? 10 : 0,
                x: activeCard === 2 ? 0 : activeCard === 0 ? -40 : activeCard === 1 ? 40 : 0,
                y: activeCard === 2 ? -20 : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-5">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Resolved Complaints</h3>
              <p className="text-white/80 text-center text-sm">
                View your previously resolved complaints and see how your reports made a difference.
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
      `}</style>
    </div>
  );
}
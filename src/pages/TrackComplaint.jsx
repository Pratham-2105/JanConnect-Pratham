import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function TrackComplaint() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);

  // Sample data
  useEffect(() => {
    const sampleComplaints = [
      {
        id: "COMP-001",
        title: "Pothole on Main Street",
        category: "Infrastructure",
        status: "in-progress",
        date: "2023-10-15",
        description: "Large pothole causing traffic issues",
        updates: [
          { date: "2023-10-16", message: "Complaint received and assigned to department" },
          { date: "2023-10-18", message: "Site inspection scheduled" }
        ]
      },
      {
        id: "COMP-002",
        title: "Garbage not collected",
        category: "Sanitation",
        status: "resolved",
        date: "2023-10-10",
        description: "Garbage hasn't been collected for 5 days",
        updates: [
          { date: "2023-10-11", message: "Complaint received" },
          { date: "2023-10-12", message: "Collection scheduled" },
          { date: "2023-10-13", message: "Issue resolved" }
        ]
      },
      {
        id: "COMP-003",
        title: "Broken street light",
        category: "Public Safety",
        status: "pending",
        date: "2023-10-20",
        description: "Street light not working on Oak Avenue",
        updates: [
          { date: "2023-10-20", message: "Complaint received" }
        ]
      }
    ];
    
    setComplaints(sampleComplaints);
    setFilteredComplaints(sampleComplaints);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query === "") {
      setFilteredComplaints(complaints);
    } else {
      const filtered = complaints.filter(complaint => 
        complaint.title.toLowerCase().includes(query) || 
        complaint.id.toLowerCase().includes(query) ||
        complaint.category.toLowerCase().includes(query)
      );
      setFilteredComplaints(filtered);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress": return <Clock className="h-5 w-5 text-blue-500" />;
      case "pending": return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved": return "bg-green-500/20 text-green-400";
      case "in-progress": return "bg-blue-500/20 text-blue-400";
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-red-500/20 text-red-400";
    }
  };

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

      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <motion.button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-800 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </motion.button>
          
          <motion.div 
            className="text-xl md:text-2xl font-bold text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Track Your Complaints
          </motion.div>
          
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-4 relative z-10 mt-16">
        <motion.div 
          className="w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 border border-white/20 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mr-4">
              <Search className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Your Complaints</h1>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by complaint ID, title, or category..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-white focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 placeholder:text-white/60"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
          </div>

          {/* Complaints List */}
          <div className="space-y-4">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint, index) => (
                <motion.div 
                  key={complaint.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{complaint.title}</h3>
                      <p className="text-white/60 text-sm">ID: {complaint.id} • {complaint.date}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)} flex items-center`}>
                      {getStatusIcon(complaint.status)}
                      <span className="ml-1 capitalize">{complaint.status.replace("-", " ")}</span>
                    </div>
                  </div>
                  
                  <p className="text-white/80 text-sm mb-3">{complaint.description}</p>
                  
                  <div className="text-xs text-white/60">
                    <p className="font-medium mb-1">Latest Update:</p>
                    <p>{complaint.updates[complaint.updates.length - 1].message}</p>
                    <p className="mt-1">{complaint.updates[complaint.updates.length - 1].date}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-white/60">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No complaints found matching your search.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
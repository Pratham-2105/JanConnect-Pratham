import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, Clock, CheckCircle, XCircle, AlertTriangle, 
  FileText, Calendar, MapPin, Building, User, Loader2, Plus, Filter
} from "lucide-react";
import { getUserReports } from '../api/report';

export default function TrackComplaint() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const fetchUserComplaints = async () => {
      setLoading(true);
      setError("");
      
      try {
        const response = await getUserReports({ page: 1, limit: 50 });
        const complaintsData = response.data.data.reports || [];
        setComplaints(complaintsData);
        setFilteredComplaints(complaintsData);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        
        if (err.response?.status === 401) {
          setError("Please login again to view your complaints");
          navigate('/login');
        } else if (err.response?.status === 404) {
          setError("No complaints found");
        } else {
          setError(err.response?.data?.message || "Failed to load complaints");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserComplaints();
  }, [userId, navigate]);

  useEffect(() => {
    let filtered = complaints;

    if (selectedStatus !== "all") {
      filtered = filtered.filter(complaint => complaint.status === selectedStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(complaint => 
        complaint.title.toLowerCase().includes(query) || 
        complaint.reportId.toLowerCase().includes(query) ||
        complaint.category.toLowerCase().includes(query)
      );
    }

    setFilteredComplaints(filtered);
  }, [complaints, selectedStatus, searchQuery]);

  const getStatusConfig = (status) => {
    const configs = {
      "resolved": { 
        icon: CheckCircle, 
        bg: "bg-emerald-500/10", 
        text: "text-emerald-400",
        border: "border-emerald-500/20"
      },
      "in-progress": { 
        icon: Clock, 
        bg: "bg-blue-500/10", 
        text: "text-blue-400",
        border: "border-blue-500/20"
      },
      "acknowledged": { 
        icon: AlertTriangle, 
        bg: "bg-amber-500/10", 
        text: "text-amber-400",
        border: "border-amber-500/20"
      },
      "pending": { 
        icon: Clock, 
        bg: "bg-orange-500/10", 
        text: "text-orange-400",
        border: "border-orange-500/20"
      },
      "rejected": { 
        icon: XCircle, 
        bg: "bg-red-500/10", 
        text: "text-red-400",
        border: "border-red-500/20"
      }
    };
    return configs[status] || configs["pending"];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusCount = (status) => {
    return complaints.filter(c => c.status === status).length;
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/userpagebg.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white border border-white/20"
              whileHover={{ scale: 1.02, x: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back</span>
            </motion.button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">My Complaints</h1>
              <p className="text-sm text-white/60 mt-1">{complaints.length} total complaints</p>
            </div>
            
            <motion.button
              onClick={() => navigate(`/user/${userId}/raise`)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={18} />
              <span className="font-medium">New</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="flex-1 relative z-10 px-4 py-6 max-w-7xl mx-auto w-full">
        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {[
            { label: "Total", count: complaints.length, status: "all" },
            { label: "Pending", count: getStatusCount("pending"), status: "pending" },
            { label: "In Progress", count: getStatusCount("in-progress"), status: "in-progress" },
            { label: "Resolved", count: getStatusCount("resolved"), status: "resolved" }
          ].map((stat, index) => (
            <motion.button
              key={stat.label}
              onClick={() => setSelectedStatus(stat.status)}
              className={`p-4 rounded-2xl border transition-all duration-300 text-left ${
                selectedStatus === stat.status 
                  ? 'bg-white/20 border-white/30' 
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-2xl font-bold text-white">{stat.count}</div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </motion.button>
          ))}
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div 
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search complaints by title, ID, or category..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <XCircle className="mx-auto mb-3 text-red-400" size={48} />
              <p className="text-red-300 text-lg font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-white mb-4" size={48} />
            <p className="text-white/70 text-lg">Loading your complaints...</p>
          </div>
        )}

        {/* Complaints List */}
        {!loading && !error && (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint, index) => {
                  const statusConfig = getStatusConfig(complaint.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <motion.div
                      key={complaint._id || complaint.reportId}
                      className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:shadow-2xl"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate(`/complaint/${complaint.reportId}`)}
                      layout
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors mb-2 line-clamp-1">
                            {complaint.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span className="flex items-center gap-1">
                              <FileText size={14} />
                              {complaint.reportId}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(complaint.createdAt || complaint.date)}
                            </span>
                            <span className="px-2 py-1 bg-white/10 rounded-lg text-xs">
                              {complaint.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                          <StatusIcon size={16} />
                          <span className="capitalize">{complaint.status.replace('-', ' ')}</span>
                        </div>
                      </div>

                      <p className="text-white/80 mb-4 line-clamp-2 leading-relaxed">
                        {complaint.description}
                      </p>

                      {/* Location & Municipality */}
                      <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-4">
                        {complaint.location?.address && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span className="truncate max-w-xs">{complaint.location.address}</span>
                          </span>
                        )}
                        {complaint.municipality?.name && (
                          <span className="flex items-center gap-1">
                            <Building size={14} />
                            {complaint.municipality.name}
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span>👍 {complaint.upvoteCount || 0}</span>
                          <span>Priority: {complaint.priority || 1}/5</span>
                          {complaint.rating && <span>⭐ {complaint.rating}/5</span>}
                        </div>
                        <div className="text-white/40 text-sm">Click to view details</div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div 
                  className="text-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FileText className="mx-auto mb-6 text-white/30" size={80} />
                  {searchQuery || selectedStatus !== "all" ? (
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-3">No matches found</h3>
                      <p className="text-white/60 mb-6 max-w-md mx-auto">
                        Try adjusting your search terms or filter to find what you're looking for.
                      </p>
                      <motion.button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedStatus("all");
                        }}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Clear filters
                      </motion.button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-3">No complaints yet</h3>
                      <p className="text-white/60 mb-8 max-w-md mx-auto">
                        You haven't submitted any complaints. Start by reporting an issue in your area.
                      </p>
                      <motion.button
                        onClick={() => navigate(`/raise-complaint/${userId}`)}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Submit Your First Complaint
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

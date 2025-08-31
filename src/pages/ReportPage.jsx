import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, 
  Calendar, MapPin, Building2, User, Star, Loader2,
  FileText, Eye, ThumbsUp, MessageSquare
} from "lucide-react";
import { getReportById } from '../api/report'; // Import your API function

export default function ComplaintDetailPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      setLoading(true);
      setError("");
      
      try {
        const response = await getReportById(reportId);
        console.log('Fetched complaint details:', response.data);
        
        setComplaint(response.data.data.report);
        
      } catch (err) {
        console.error('Error fetching complaint details:', err);
        
        if (err.response?.status === 401) {
          setError("Please login again to view complaint details");
          navigate('/login');
        } else if (err.response?.status === 404) {
          setError("Complaint not found");
        } else {
          setError(err.response?.data?.message || "Failed to load complaint details");
        }
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchComplaintDetails();
    }
  }, [reportId, navigate]);

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
        icon: AlertCircle, 
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-white/30"}`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLatestUpdate = (updates) => {
    if (!updates || updates.length === 0) {
      return { message: "No updates available", date: null };
    }
    return updates[updates.length - 1];
  };

  if (loading) {
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

        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
            <p className="text-white/80 text-lg">Loading complaint details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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

        <div className="flex-1 flex items-center justify-center relative z-10 p-4">
          <motion.div 
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Error</h2>
            <p className="text-white/80 mb-6">{error}</p>
            <motion.button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Back
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!complaint) return null;

  const statusConfig = getStatusConfig(complaint.status);
  const StatusIcon = statusConfig.icon;
  const latestUpdate = getLatestUpdate(complaint.updates);

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
              <h1 className="text-xl font-bold text-white">Complaint Details</h1>
              <p className="text-sm text-white/60 mt-1">{complaint.reportId}</p>
            </div>
            
            <div className="w-20" />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 relative z-10 px-4 py-6 max-w-5xl mx-auto w-full">
        <motion.div 
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{complaint.title}</h2>
                <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                  <span className="flex items-center gap-1">
                    <FileText size={14} />
                    {complaint.reportId}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(complaint.createdAt)}
                  </span>
                  <span className="px-2 py-1 bg-white/10 rounded-lg text-xs">
                    {complaint.category}
                  </span>
                </div>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                <StatusIcon size={16} />
                <span className="capitalize">{complaint.status.replace('-', ' ')}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white/5 rounded-xl">
                <ThumbsUp className="h-5 w-5 mx-auto mb-1 text-blue-400" />
                <div className="text-lg font-bold text-white">{complaint.upvoteCount || 0}</div>
                <div className="text-xs text-white/60">Upvotes</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-xl">
                <Eye className="h-5 w-5 mx-auto mb-1 text-green-400" />
                <div className="text-lg font-bold text-white">{complaint.viewCount || 0}</div>
                <div className="text-xs text-white/60">Views</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-xl">
                <Clock className="h-5 w-5 mx-auto mb-1 text-orange-400" />
                <div className="text-lg font-bold text-white">{complaint.priority || 1}/5</div>
                <div className="text-xs text-white/60">Priority</div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/90 leading-relaxed">{complaint.description}</p>
                </div>
              </div>

              {/* Location */}
              {complaint.location?.address && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Location</h3>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin size={16} />
                      <span>{complaint.location.address}</span>
                    </div>
                    {complaint.location.coordinates && (
                      <div className="text-xs text-white/60 mt-2">
                        Coordinates: {complaint.location.coordinates[1].toFixed(6)}, {complaint.location.coordinates[0].toFixed(6)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Updates Timeline */}
              {complaint.updates && complaint.updates.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Progress Timeline</h3>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="space-y-4">
                      {complaint.updates.map((update, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                            {index < complaint.updates.length - 1 && (
                              <div className="w-0.5 h-8 bg-blue-400/30 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="text-white/90 font-medium">{update.message}</p>
                            <p className="text-white/50 text-sm mt-1">{formatDate(update.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Media */}
              {complaint.media && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Attachments</h3>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    {complaint.media.type === 'image' ? (
                      <img 
                        src={complaint.media.url} 
                        alt="Complaint attachment" 
                        className="w-full max-w-md rounded-lg"
                      />
                    ) : (
                      <video 
                        src={complaint.media.url} 
                        controls 
                        className="w-full max-w-md rounded-lg"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Assignment Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Assignment</h3>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
                  {complaint.municipality?.name && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Building2 size={16} />
                      <div>
                        <div className="text-sm text-white/60">Municipality</div>
                        <div className="font-medium">{complaint.municipality.name}</div>
                      </div>
                    </div>
                  )}
                  {complaint.department?.name && (
                    <div className="flex items-center gap-2 text-white/80">
                      <User size={16} />
                      <div>
                        <div className="text-sm text-white/60">Department</div>
                        <div className="font-medium">{complaint.department.name}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Latest Update */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Latest Update</h3>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/90 mb-2">{latestUpdate.message}</p>
                  {latestUpdate.date && (
                    <p className="text-white/50 text-sm">{formatDate(latestUpdate.date)}</p>
                  )}
                </div>
              </div>

              {/* Rating & Feedback */}
              {(complaint.rating || complaint.feedback) && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">User Feedback</h3>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    {complaint.rating && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {renderStars(complaint.rating)}
                        </div>
                        <span className="text-white/80">{complaint.rating}/5</span>
                      </div>
                    )}
                    {complaint.feedback && (
                      <p className="text-white/80 italic">"{complaint.feedback}"</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence,motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Star, Calendar, MapPin } from "lucide-react";

export default function ResolvedComplaints() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Sample data
  useEffect(() => {
    const sampleComplaints = [
      {
        id: "COMP-002",
        title: "Garbage not collected",
        category: "Sanitation",
        date: "2023-10-10",
        resolvedDate: "2023-10-13",
        description: "Garbage hasn't been collected for 5 days",
        location: "123 Main Street",
        updates: [
          { date: "2023-10-11", message: "Complaint received" },
          { date: "2023-10-12", message: "Collection scheduled" },
          { date: "2023-10-13", message: "Issue resolved - garbage collected" }
        ],
        rating: 4,
        feedback: "Quick response time, satisfied with the resolution"
      },
      {
        id: "COMP-004",
        title: "Water logging during rain",
        category: "Infrastructure",
        date: "2023-09-25",
        resolvedDate: "2023-10-05",
        description: "Road gets flooded even with light rain",
        location: "Oak Avenue & 5th Street",
        updates: [
          { date: "2023-09-26", message: "Complaint received" },
          { date: "2023-09-28", message: "Inspected drainage system" },
          { date: "2023-10-02", message: "Drainage cleaning initiated" },
          { date: "2023-10-05", message: "Issue resolved - drainage system improved" }
        ],
        rating: 5,
        feedback: "Excellent work! The problem is completely solved."
      },
      {
        id: "COMP-005",
        title: "Illegal parking issue",
        category: "Public Safety",
        date: "2023-09-15",
        resolvedDate: "2023-09-20",
        description: "Vehicles parked illegally blocking emergency access",
        location: "Maple Road",
        updates: [
          { date: "2023-09-16", message: "Complaint received" },
          { date: "2023-09-18", message: "Traffic police notified" },
          { date: "2023-09-20", message: "Issue resolved - warning signs installed" }
        ],
        rating: 3,
        feedback: "Issue was resolved but took longer than expected"
      }
    ];
    
    setResolvedComplaints(sampleComplaints);
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-white/30"}`}
      />
    ));
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
            Resolved Complaints
          </motion.div>
          
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-4 relative z-10 mt-16">
        <motion.div 
          className="w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Resolved Issues</h1>
          </div>

          {resolvedComplaints.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resolvedComplaints.map((complaint, index) => (
                <motion.div 
                  key={complaint.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setSelectedComplaint(complaint)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{complaint.title}</h3>
                    <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      Resolved
                    </div>
                  </div>
                  
                  <div className="flex items-center text-white/60 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Resolved on {complaint.resolvedDate}</span>
                  </div>
                  
                  <div className="flex items-center text-white/60 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{complaint.location}</span>
                  </div>
                  
                  <p className="text-white/80 text-sm mb-3 line-clamp-2">{complaint.description}</p>
                  
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {renderStars(complaint.rating)}
                    </div>
                    <span className="text-white/60 text-sm">{complaint.rating}/5</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No resolved complaints yet.</p>
            </div>
          )}
        </motion.div>

        {/* Complaint Detail Modal */}
        <AnimatePresence>
          {selectedComplaint && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white">{selectedComplaint.title}</h2>
                  <button 
                    onClick={() => setSelectedComplaint(null)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-white/80">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Reported: {selectedComplaint.date}</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                    <span>Resolved: {selectedComplaint.resolvedDate}</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{selectedComplaint.location}</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <span>Category: {selectedComplaint.category}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-white/80">{selectedComplaint.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Resolution Timeline</h3>
                  <div className="space-y-3">
                    {selectedComplaint.updates.map((update, index) => (
                      <div key={index} className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                          {index < selectedComplaint.updates.length - 1 && (
                            <div className="w-0.5 h-12 bg-indigo-400/30 mt-1"></div>
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="text-white font-medium">{update.message}</p>
                          <p className="text-white/60 text-sm">{update.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Your Feedback</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {renderStars(selectedComplaint.rating)}
                    </div>
                    <span className="text-white/80">{selectedComplaint.rating}/5</span>
                  </div>
                  <p className="text-white/80 italic">"{selectedComplaint.feedback}"</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
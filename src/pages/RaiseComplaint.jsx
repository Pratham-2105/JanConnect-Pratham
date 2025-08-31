import { useState, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, AlertCircle, Upload, X, Navigation, CheckCircle } from "lucide-react";
import Autocomplete from "react-google-autocomplete";
import { createReport } from '../api/report';

// Simple Custom Modal Component
const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default function RaiseComplaint() {
  const navigate = useNavigate();
  const { userId } = useParams();
  
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: {
      address: "",
      coordinates: [0, 0],
      placeId: null,
      city: "",
      state: "",
      country: ""
    },
    urgency: "medium",
    media: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "address") {
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, address: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePlaceSelected = (place) => {
    console.log('Selected place:', place);
    
    if (place.geometry && place.geometry.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      
      let city = "", state = "", country = "";
      
      if (place.address_components) {
        place.address_components.forEach(component => {
          const types = component.types;
          
          if (types.includes('locality')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.long_name;
          } else if (types.includes('country')) {
            country = component.long_name;
          }
        });
      }

      setFormData(prev => ({
        ...prev,
        location: {
          address: place.formatted_address || place.name,
          coordinates: [lng, lat],
          placeId: place.place_id,
          city,
          state,
          country
        }
      }));

      setError("");
      console.log('Location updated:', { lat, lng, address: place.formatted_address });
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setIsGettingLocation(true);
    setError("");

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
          );
          
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            const result = data.results[0];
            
            let city = "", state = "", country = "";
            
            result.address_components.forEach(component => {
              const types = component.types;
              
              if (types.includes('locality')) {
                city = component.long_name;
              } else if (types.includes('administrative_area_level_1')) {
                state = component.long_name;
              } else if (types.includes('country')) {
                country = component.long_name;
              }
            });

            setFormData(prev => ({
              ...prev,
              location: {
                address: result.formatted_address,
                coordinates: [longitude, latitude],
                placeId: result.place_id,
                city,
                state,
                country
              }
            }));

            console.log('Current location captured:', {
              address: result.formatted_address,
              coordinates: [longitude, latitude]
            });
          } else {
            throw new Error('No address found for current location');
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              address: `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              coordinates: [longitude, latitude]
            }
          }));
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsGettingLocation(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("Location access denied by user");
            break;
          case error.POSITION_UNAVAILABLE:
            setError("Location information is unavailable");
            break;
          case error.TIMEOUT:
            setError("Location request timed out");
            break;
          default:
            setError("An unknown error occurred while retrieving location");
            break;
        }
      },
      options
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB");
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
      if (!validTypes.includes(file.type)) {
        setError("Only images (JPEG, PNG, WebP) and videos (MP4, WebM) are allowed");
        return;
      }

      setFormData(prev => ({ ...prev, media: file }));
      setError("");

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, media: null }));
    setPreviewUrl("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!formData.location.address || (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0)) {
      setError("Please select a valid location or use current location");
      setIsSubmitting(false);
      return;
    }

    try {
      const submitFormData = new FormData();
      
      submitFormData.append('title', formData.title);
      submitFormData.append('category', formData.category);
      submitFormData.append('description', formData.description);
      submitFormData.append('urgency', formData.urgency);
      submitFormData.append('location[address]', formData.location.address);
      submitFormData.append('location[coordinates]', JSON.stringify(formData.location.coordinates));
      
      if (formData.media) {
        submitFormData.append('media', formData.media);
      }

      console.log('Submitting report with location:', formData.location);

      const response = await createReport(submitFormData);
      
      console.log('Report created successfully:', response.data);
      
      setSubmittedDetails({
        reportId: response.data.data.report.reportId,
        municipality: response.data.data.autoSelected?.municipality || 'Municipal Authority'
      });
      
      setShowSuccessPopup(true);

    } catch (error) {
      console.error('Error submitting report:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError("Please login again to submit reports");
        navigate('/login');
      } else {
        setError("Failed to submit report. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopupAndNavigate = () => {
    setShowSuccessPopup(false);
    navigate(`/user/${userId}`);
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
            Raise a Complaint
          </motion.div>
          
          <div className="w-10" />
        </div>
      </motion.header>

      {/* Success Popup - Using Custom Modal */}
      <CustomModal isOpen={showSuccessPopup} onClose={closePopupAndNavigate}>
        <AnimatePresence>
          {showSuccessPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-full max-w-md border border-white/20"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white text-center mb-2">
                Report Submitted Successfully!
              </h3>

              <div className="text-center space-y-3">
                <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4">
                  <p className="text-green-200 text-sm mb-2">
                    <strong>Report ID:</strong> {submittedDetails?.reportId}
                  </p>
                  <p className="text-green-200 text-sm">
                    <strong>Assigned to:</strong> {submittedDetails?.municipality}
                  </p>
                </div>

                <p className="text-white/80 text-sm">
                  Your complaint has been successfully submitted and will be reviewed by the municipal authority.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={closePopupAndNavigate}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View My Reports
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CustomModal>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 mt-16">
        <motion.div 
          className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-4">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Report an Issue</h1>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div 
              className="mb-4 p-3 bg-red-500/20 border border-red-400 rounded-xl text-red-200 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Complaint Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-white focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 placeholder:text-white/60"
                placeholder="Brief description of the issue"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-white focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200"
              >
                <option value="">Select a category</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Street Lighting">Street Lighting</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Traffic">Traffic</option>
                <option value="Parks">Parks</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-white focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 placeholder:text-white/60"
                placeholder="Please provide detailed information about the issue..."
              />
            </div>

            {/* Location with Google Autocomplete */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Location * 
                <span className="text-white/60 text-xs ml-2">(Search or select current location)</span>
              </label>
              
              <div className="space-y-3">
                <div className="relative">
                  <Autocomplete
                    apiKey={GOOGLE_MAPS_API_KEY}
                    onPlaceSelected={handlePlaceSelected}
                    value={formData.location.address}
                    onChange={(e) => handleInputChange({ target: { name: 'address', value: e.target.value } })}
                    options={{
                      types: [],
                      componentRestrictions: { country: "in" },
                      fields: ["address_components", "geometry", "formatted_address", "place_id", "name"]
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-white focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 placeholder:text-white/60"
                    placeholder="Type to search location (e.g., Park Street, Ranchi)"
                    required
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                </div>
                
                <motion.button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="w-full py-2 text-sm bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl text-white/80 hover:bg-gradient-to-r hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isGettingLocation ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Getting location...
                    </>
                  ) : (
                    <>
                      <Navigation className="mr-2 h-4 w-4" />
                      📍 Use Current Location
                    </>
                  )}
                </motion.button>

                {formData.location.coordinates[0] !== 0 && formData.location.coordinates[1] !== 0 && (
                  <div className="p-3 bg-green-500/10 border border-green-400/30 rounded-xl">
                    <p className="text-green-200 text-sm">
                      ✅ Location captured: {formData.location.city && `${formData.location.city}, `}{formData.location.state}
                    </p>
                    {/* <p className="text-green-200/70 text-xs">
                      Coordinates: {formData.location.coordinates[1].toFixed(6)}, {formData.location.coordinates[0].toFixed(6)}
                    </p> */}
                  </div>
                )}
              </div>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Urgency Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['low', 'medium', 'high'].map(level => (
                  <button
                    key={level}
                    type="button"
                    className={`py-2 rounded-xl border transition-all duration-200 ${
                      formData.urgency === level 
                        ? level === 'high' 
                          ? 'bg-red-500/20 border-red-400 text-white' 
                          : level === 'medium'
                            ? 'bg-yellow-500/20 border-yellow-400 text-white'
                            : 'bg-green-500/20 border-green-400 text-white'
                        : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, urgency: level }))}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Add Photo/Video (Optional)</label>
              
              {previewUrl && (
                <div className="mb-3 relative">
                  {formData.media?.type.startsWith('image/') ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                  ) : (
                    <video src={previewUrl} className="w-full h-32 object-cover rounded-xl" controls />
                  )}
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 p-1 bg-red-500/70 rounded-full hover:bg-red-500/90"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  <p className="text-white/60 text-xs mt-1">{formData.media?.name}</p>
                </div>
              )}
              
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-white/60 mx-auto mb-2" />
                  <p className="text-white/60 text-sm">Click to upload image or video</p>
                  <p className="text-white/40 text-xs">Max 50MB • JPEG, PNG, WebP, MP4, WebM</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm" 
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || isGettingLocation}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-70"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Complaint"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

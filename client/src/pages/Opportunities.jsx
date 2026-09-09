import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, Map as MapIcon, List, Filter, MapPin, Briefcase, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix Leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCompensations, setSelectedCompensations] = useState([]);
  
  useEffect(() => {
    const fetchOpps = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/opportunities');
        setOpportunities(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, []);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleCompensation = (comp) => {
    setSelectedCompensations(prev => 
      prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp]
    );
  };

  const filteredOpps = opportunities.filter(opp => {
    const s = searchTerm.toLowerCase();
    const titleMatch = opp.title && opp.title.toLowerCase().includes(s);
    const uniStr = typeof opp.university === 'string' ? opp.university : (opp.university?.name || '');
    const uniMatch = uniStr.toLowerCase().includes(s);
    
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(opp.category);
    const compensationMatch = selectedCompensations.length === 0 || selectedCompensations.includes(opp.compensation?.type);
    
    return (titleMatch || uniMatch) && categoryMatch && compensationMatch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-12 transition-colors duration-300">
      {/* Header Banner */}
      <div className="bg-indigo-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-animated-gradient opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
          >
            Explore Opportunities
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-indigo-200 text-lg max-w-2xl font-light"
          >
            Discover and apply for research assistantships, internships, and academic projects across top institutions.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 relative -mt-8 z-20">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800/40 p-8 sticky top-24 backdrop-blur-2xl bg-white/80 dark:bg-slate-950/90 transition-all duration-300"
          >
            <h2 className="font-extrabold text-2xl mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
              <Filter className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Filters
            </h2>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Keywords or University..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Category</label>
              <div className="space-y-3">
                {['Research', 'Internship', 'Project', 'Teaching Assistant', 'Field Work', 'Data Collection'].map(cat => (
                  <div key={cat} className="flex items-center group cursor-pointer" onClick={() => toggleCategory(cat)}>
                    <div className="relative flex items-center">
                      <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${selectedCategories.includes(cat) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                        {selectedCategories.includes(cat) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <span className={`ml-3 text-sm font-medium transition-colors ${selectedCategories.includes(cat) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 group-hover:text-indigo-500'}`}>{cat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Compensation</label>
              <div className="space-y-3">
                {['Stipend', 'Unpaid', 'Certificate Only', 'Project Allowance', 'Mixed'].map(comp => (
                  <div key={comp} className="flex items-center group cursor-pointer" onClick={() => toggleCompensation(comp)}>
                    <div className="relative flex items-center">
                      <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${selectedCompensations.includes(comp) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                        {selectedCompensations.includes(comp) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <span className={`ml-3 text-sm font-medium transition-colors ${selectedCompensations.includes(comp) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 group-hover:text-indigo-500'}`}>{comp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-between items-center mb-6 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800"
          >
            <div className="px-4 font-medium text-slate-500 dark:text-slate-400">
              Showing <span className="font-bold text-slate-900 dark:text-slate-100">{filteredOpps.length}</span> results
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                <List className="w-4 h-4" /> List
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                <MapIcon className="w-4 h-4" /> Map
              </button>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
            </div>
          ) : viewMode === 'list' ? (
            <AnimatePresence>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredOpps.length === 0 ? (
                  <motion.div variants={itemVariants} className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No opportunities found</h3>
                    <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
                  </motion.div>
                ) : (
                  filteredOpps.map(opp => (
                    <motion.div 
                      variants={itemVariants}
                      layout
                      key={opp._id} 
                      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md dark:hover:shadow-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all group flex flex-col sm:flex-row gap-6 relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500 dark:bg-indigo-600 transform scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-300"></div>
                      
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-3">
                          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            <Link to={`/opportunities/${opp._id}`} className="focus:outline-none">
                              {opp.title}
                              <span className="absolute inset-0" aria-hidden="true" />
                            </Link>
                          </h2>
                          <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider whitespace-nowrap ml-4 border border-indigo-100 dark:border-indigo-800/50">
                            {opp.category}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium">
                          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-md">
                            <Briefcase className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                            {opp.university?.name || opp.university}
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-md">
                            <MapPin className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                            {opp.location?.city || 'Location N/A'}
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-md text-amber-600 dark:text-amber-400">
                            <Clock className="w-4 h-4" />
                            Due: {new Date(opp.applicationSettings.deadline).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2 text-base leading-relaxed mb-4">{opp.description}</p>
                        
                        <div className="flex flex-wrap gap-2 relative z-10">
                          {opp.requirements?.skills?.slice(0, 4).map(skill => (
                            <span key={skill} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-600 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-md">
                              {skill}
                            </span>
                          ))}
                          {opp.requirements?.skills?.length > 4 && (
                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold px-2.5 py-1 rounded-md">
                              +{opp.requirements.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="sm:w-56 flex flex-col justify-between sm:items-end border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-6 relative z-10">
                        <div className="mb-4 sm:text-right w-full bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl sm:bg-transparent sm:p-0">
                          <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Compensation</div>
                          <div className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">{opp.compensation?.type}</div>
                          {opp.compensation?.amount && <div className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-1">{opp.compensation.amount}</div>}
                        </div>
                        <Link 
                          to={`/opportunities/${opp._id}`} 
                          className="w-full flex justify-center items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white px-5 py-3 rounded-xl font-bold transition-colors group/btn"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-2 rounded-2xl border border-slate-200 shadow-lg overflow-hidden" 
              style={{ height: '600px' }}
            >
              <MapContainer center={[37.4275, -122.1697]} zoom={3} scrollWheelZoom={false} style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredOpps.map(opp => {
                  const hasLocation = opp.university?.location?.coordinates || opp.location?.geo?.coordinates;
                  if (!hasLocation) return null;
                  
                  // MongoDB geospatial uses [longitude, latitude], Leaflet uses [latitude, longitude]
                  const coords = opp.university?.location?.coordinates 
                    ? [opp.university.location.coordinates[1], opp.university.location.coordinates[0]]
                    : [opp.location.geo.coordinates[1], opp.location.geo.coordinates[0]];

                  return (
                    <Marker key={opp._id} position={coords}>
                      <Popup className="rounded-xl">
                        <div className="p-2">
                          <h3 className="font-bold text-lg mb-1 leading-tight">{opp.title}</h3>
                          <p className="text-sm text-slate-600 mb-3 flex items-center gap-1"><Briefcase className="w-3 h-3"/> {opp.university?.name || opp.university}</p>
                          <Link to={`/opportunities/${opp._id}`} className="inline-block bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 text-sm font-bold w-full text-center transition-colors">View Details</Link>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Opportunities;

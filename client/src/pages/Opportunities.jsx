import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, Map as MapIcon, List, Filter, MapPin, Briefcase, Clock, ChevronRight, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix Leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CATEGORY_COLORS = {
  'Research':           { bg: 'bg-indigo-500',   light: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50', bar: 'bg-indigo-500' },
  'Internship':         { bg: 'bg-rose-500',      light: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50', bar: 'bg-rose-500' },
  'Project':            { bg: 'bg-emerald-500',   light: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50', bar: 'bg-emerald-500' },
  'Teaching Assistant': { bg: 'bg-amber-500',     light: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50', bar: 'bg-amber-500' },
  'Field Work':         { bg: 'bg-sky-500',       light: 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/50', bar: 'bg-sky-500' },
  'Data Collection':    { bg: 'bg-purple-500',    light: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50', bar: 'bg-purple-500' },
};

const CATEGORIES = ['Research', 'Internship', 'Project', 'Teaching Assistant', 'Field Work', 'Data Collection'];
const COMPENSATIONS = ['Stipend', 'Unpaid', 'Certificate Only', 'Project Allowance', 'Mixed'];

const FilterPill = ({ label, selected, onToggle, color }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onToggle}
    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${
      selected
        ? `${color || 'bg-indigo-600 border-indigo-600 text-white'} shadow-sm`
        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400'
    }`}
  >
    {selected && <X className="w-3 h-3" />}
    {label}
  </motion.button>
);

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCompensations, setSelectedCompensations] = useState([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  useEffect(() => {
    const fetchOpps = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/opportunities`);
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
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const toggleCompensation = (comp) => {
    setSelectedCompensations(prev => prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp]);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedCompensations([]);
    setSearchTerm('');
  };

  const hasFilters = selectedCategories.length > 0 || selectedCompensations.length > 0 || searchTerm;

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
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-widest">Search</label>
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Keywords or University..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-widest">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const sel = selectedCategories.includes(cat);
            const catStyle = CATEGORY_COLORS[cat];
            return (
              <FilterPill
                key={cat}
                label={cat}
                selected={sel}
                onToggle={() => toggleCategory(cat)}
                color={sel ? `${catStyle?.bg || 'bg-indigo-600'} border-transparent text-white` : ''}
              />
            );
          })}
        </div>
      </div>

      {/* Compensation */}
      <div>
        <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-widest">Compensation</label>
        <div className="flex flex-wrap gap-2">
          {COMPENSATIONS.map(comp => (
            <FilterPill
              key={comp}
              label={comp}
              selected={selectedCompensations.includes(comp)}
              onToggle={() => toggleCompensation(comp)}
              color={selectedCompensations.includes(comp) ? 'bg-emerald-600 border-transparent text-white' : ''}
            />
          ))}
        </div>
      </div>

      {hasFilters && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={clearFilters}
          className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 text-sm font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" /> Clear All Filters
        </motion.button>
      )}
    </div>
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16 transition-colors duration-300">
      {/* Header Banner */}
      <div className="bg-indigo-900 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-animated-gradient opacity-20" />
        <div className="dots-pattern absolute inset-0 opacity-20" />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-indigo-300 text-sm font-bold uppercase tracking-widest mb-2"
          >âœ¦ Browse & Apply</motion.p>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight"
          >
            Explore Opportunities
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-indigo-200/80 text-lg max-w-2xl font-light"
          >
            Discover and apply for research assistantships, internships, and academic projects across top institutions.
          </motion.p>
        </div>
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L48 34C96 28 192 16 288 13.3C384 10.7 480 17.3 576 21.3C672 25.3 768 26.7 864 23.3C960 20 1056 13 1152 10C1248 7 1344 7 1392 7.2L1440 7.3V40H0Z"
              className="fill-slate-50 dark:fill-slate-950"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 relative -mt-2 z-20">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-300 shadow-sm w-full justify-center"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {hasFilters && <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">{selectedCategories.length + selectedCompensations.length}</span>}
          </button>
          <AnimatePresence>
            {isMobileFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mt-3 shadow-sm">
                  <FilterPanel />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-7 sticky top-24"
          >
            <h2 className="font-extrabold text-lg mb-7 flex items-center gap-2.5 text-slate-900 dark:text-white">
              <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              Filters
            </h2>
            <FilterPanel />
          </motion.div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow min-w-0">
          {/* Toolbar */}
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center mb-5 bg-white dark:bg-slate-900 px-5 py-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <div className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-extrabold text-slate-900 dark:text-white text-base">{filteredOpps.length}</span>
              <span className="ml-1">result{filteredOpps.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                <List className="w-4 h-4" /> List
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                <MapIcon className="w-4 h-4" /> Map
              </button>
            </div>
          </motion.div>

          {loading ? (
            <div className="space-y-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 h-40 shimmer" />
              ))}
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
                  <motion.div variants={itemVariants} className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No opportunities found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-5">Try adjusting your search or filters.</p>
                    {hasFilters && (
                      <button onClick={clearFilters} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                        Clear all filters
                      </button>
                    )}
                  </motion.div>
                ) : (
                  filteredOpps.map(opp => {
                    const catStyle = CATEGORY_COLORS[opp.category] || {};
                    return (
                      <motion.div 
                        variants={itemVariants}
                        layout
                        key={opp._id} 
                        whileHover={{ y: -2 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg dark:hover:shadow-slate-950/30 hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all group flex flex-col sm:flex-row overflow-hidden"
                      >
                        {/* Left accent bar â€” category-colored */}
                        <div className={`w-1.5 sm:w-2 flex-shrink-0 ${catStyle.bar || 'bg-indigo-500'}`} />
                        
                        <div className="flex-grow p-6 flex flex-col sm:flex-row gap-5">
                          <div className="flex-grow min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${catStyle.light || 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50'} uppercase tracking-wider`}>
                                {opp.category}
                              </span>
                            </div>
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-3 leading-snug">
                              <Link to={`/opportunities/${opp._id}`} className="focus:outline-none">
                                {opp.title}
                                <span className="absolute inset-0" aria-hidden="true" />
                              </Link>
                            </h2>
                            
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-4">
                              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                <Briefcase className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                                <span className="font-semibold">{opp.university?.name || opp.university}</span>
                              </div>
                              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                <MapPin className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                                <span className="font-semibold">{opp.location?.city || 'Location N/A'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg text-amber-600 dark:text-amber-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="font-semibold">Due: {new Date(opp.applicationSettings.deadline).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-sm leading-relaxed mb-4">{opp.description}</p>
                            
                            <div className="flex flex-wrap gap-1.5 relative z-10">
                              {opp.requirements?.skills?.slice(0, 4).map(skill => (
                                <span key={skill} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-lg">
                                  {skill}
                                </span>
                              ))}
                              {opp.requirements?.skills?.length > 4 && (
                                <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold px-2.5 py-1 rounded-lg">
                                  +{opp.requirements.skills.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="sm:w-48 flex flex-col justify-between sm:items-end border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-5 relative z-10 flex-shrink-0">
                            <div className="sm:text-right mb-4">
                              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Compensation</div>
                              <div className="font-extrabold text-slate-800 dark:text-slate-100">{opp.compensation?.type}</div>
                              {opp.compensation?.amount && (
                                <div className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-1">{opp.compensation.amount}</div>
                              )}
                            </div>
                            <Link 
                              to={`/opportunities/${opp._id}`} 
                              className="w-full flex justify-center items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white px-4 py-2.5 rounded-xl font-bold transition-all text-sm group/btn"
                            >
                              View Details
                              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden" 
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
                  const coords = opp.university?.location?.coordinates 
                    ? [opp.university.location.coordinates[1], opp.university.location.coordinates[0]]
                    : [opp.location.geo.coordinates[1], opp.location.geo.coordinates[0]];
                  return (
                    <Marker key={opp._id} position={coords}>
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold text-base mb-1 leading-snug">{opp.title}</h3>
                          <p className="text-sm text-slate-600 mb-3 flex items-center gap-1"><Briefcase className="w-3 h-3"/> {opp.university?.name || opp.university}</p>
                          <Link to={`/opportunities/${opp._id}`} className="inline-block bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 text-sm font-bold w-full text-center transition-colors">View Details</Link>
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


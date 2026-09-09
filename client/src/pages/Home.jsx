import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Briefcase, GraduationCap, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [featuredOpps, setFeaturedOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/opportunities');
        setFeaturedOpps(res.data.data.slice(0, 3)); // Get top 3
      } catch (err) {
        console.error('Failed to fetch featured opportunities', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/opportunities');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
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
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-animated-gradient text-white py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[85vh]">
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Decorative Floating Shapes */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl hidden md:block"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-20 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl hidden md:block"
        />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect text-sm font-semibold mb-8 text-white"
          >
            <Sparkles className="w-4 h-4 text-rose-300" />
            <span>Discover the Future of Academic Collaboration</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-lg"
          >
            Find Academic Opportunities <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-indigo-200">Near You</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md"
          >
            Connect with leading researchers, apply for exclusive internships, and discover academic projects at your university and across the globe.
          </motion.p>
          
          <motion.form 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 200 }}
            onSubmit={handleSearch} 
            className="glass-card rounded-2xl p-2 flex flex-col sm:flex-row shadow-2xl max-w-4xl mx-auto text-slate-800 dark:text-white backdrop-blur-xl border border-white/40 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/80"
          >
            <div className="flex-grow flex items-center px-4 py-3 sm:py-4 border-b sm:border-b-0 sm:border-r border-slate-200/50 dark:border-slate-700/50">
              <Search className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mr-3" />
              <input 
                type="text" 
                placeholder="Job title, skills, or keywords" 
                className="w-full focus:outline-none bg-transparent text-lg placeholder:text-slate-400"
              />
            </div>
            <div className="flex-grow flex items-center px-4 py-3 sm:py-4">
              <MapPin className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mr-3" />
              <input 
                type="text" 
                placeholder="University or City" 
                className="w-full focus:outline-none bg-transparent text-lg placeholder:text-slate-400"
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold transition-all mt-2 sm:mt-0 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 w-full sm:w-auto text-lg"
            >
              Search
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 relative -mt-10 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Featured Opportunities</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Discover the latest prestigious roles posted by top universities.</p>
            </div>
            <Link to="/opportunities" className="hidden sm:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors group">
              Explore All <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 gap-8"
            >
              {featuredOpps.map(opp => (
                <motion.div 
                  key={opp._id} 
                  variants={itemVariants}
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm transition-all group flex flex-col h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-rose-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
                      {opp.category}
                    </span>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                      {opp.compensation?.type}
                    </span>
                  </div>
                  
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                    {opp.title}
                  </h3>
                  
                  <div className="space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-400 flex-grow">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg"><Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /></div>
                      <span className="font-medium truncate">{opp.university?.name || opp.university}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg"><MapPin className="w-4 h-4 text-rose-500 dark:text-rose-400" /></div>
                      <span className="font-medium truncate">{opp.location?.city || 'Location N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg"><Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" /></div>
                      <span className="font-medium">Deadline: {new Date(opp.applicationSettings.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/opportunities/${opp._id}`} 
                    className="mt-auto flex justify-center items-center gap-2 w-full text-center bg-slate-50 dark:bg-slate-800/50 group-hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 group-hover:text-white dark:group-hover:text-white px-6 py-3 rounded-xl font-bold transition-colors border border-slate-200 dark:border-slate-700 group-hover:border-indigo-600 dark:group-hover:border-indigo-600"
                  >
                    View Details
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <div className="mt-10 text-center sm:hidden">
            <Link to="/opportunities" className="inline-flex justify-center items-center gap-2 w-full bg-slate-900 text-white font-bold px-6 py-4 rounded-xl shadow-md">
              View all opportunities <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlNWEwZTEiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9zdmc+')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Why Choose <span className="text-indigo-600 dark:text-indigo-400">UNITY?</span></h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The premier ecosystem designed specifically to accelerate academic collaboration and supercharge your research career.
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-12"
          >
            <motion.div variants={itemVariants} className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.1)] transition-shadow group relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 dark:bg-rose-900/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-rose-500 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Location Discovery</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">Find vital opportunities near your campus or explore global remote options using our interactive geospatial mapping engine.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.1)] transition-shadow group relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Diverse Portfolio</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">From highly competitive paid research assistantships to volunteer field work, find exactly the role that matches your academic trajectory.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.1)] transition-shadow group relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-emerald-500 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Verified Network</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">Connect with absolute confidence. All faculty and students are securely verified directly through their official university credentials.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight"
          >
            Ready to accelerate your academic career?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light"
          >
            Join thousands of ambitious students and visionary researchers already collaborating to build the future on UNITY.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/register" className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 text-lg transform hover:-translate-y-1">
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/opportunities" className="bg-transparent border-2 border-slate-700 hover:border-slate-500 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center text-lg hover:bg-slate-800">
              Browse Opportunities
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

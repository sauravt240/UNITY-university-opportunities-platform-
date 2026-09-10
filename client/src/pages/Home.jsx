import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Briefcase, GraduationCap, Clock, ArrowRight, Sparkles, Users, Building, TrendingUp, CheckCircle } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

// Animated counter component — uses useState + requestAnimationFrame (no MotionValue child render issue)
const Counter = ({ target, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Home = () => {
  const [featuredOpps, setFeaturedOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/opportunities');
        setFeaturedOpps(res.data.data.slice(0, 3));
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
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const stats = [
    { icon: Briefcase, label: 'Opportunities', value: 500, suffix: '+', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { icon: Building, label: 'Universities', value: 120, suffix: '+', color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { icon: Users, label: 'Students', value: 2800, suffix: '+', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { icon: TrendingUp, label: 'Placements', value: 95, suffix: '%', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const categoryColors = {
    'Research': 'from-indigo-500 to-violet-500',
    'Internship': 'from-rose-500 to-pink-500',
    'Project': 'from-emerald-500 to-teal-500',
    'Teaching Assistant': 'from-amber-500 to-orange-500',
    'Field Work': 'from-sky-500 to-blue-500',
    'Data Collection': 'from-purple-500 to-fuchsia-500',
  };

  const howItWorks = [
    { step: '01', title: 'Create Your Profile', desc: 'Sign up with your university email and build your academic profile in minutes.', icon: GraduationCap, color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' },
    { step: '02', title: 'Discover Opportunities', desc: 'Browse curated research, internships, and projects tailored to your skills and location.', icon: Search, color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400' },
    { step: '03', title: 'Apply & Connect', desc: 'Submit your application directly through UNITY and hear back from faculty or researchers.', icon: CheckCircle, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-animated-gradient text-white py-28 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[88vh]">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Dots pattern overlay */}
        <div className="absolute inset-0 dots-pattern opacity-40" />

        {/* Decorative Blobs */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-violet-500/25 rounded-full blur-3xl animate-blob hidden md:block" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-blob animation-delay-2000 hidden md:block" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl animation-delay-4000 hidden md:block" />

        <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-effect text-sm font-semibold mb-8 text-white/90 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>The Premier Academic Opportunity Network</span>
          </motion.div>
          
          {/* Headline */}
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-lg"
          >
            Find Academic<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-indigo-200">
              Opportunities Near You
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="text-xl md:text-2xl text-indigo-100/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Connect with leading researchers, apply for exclusive internships, and discover academic projects at your university and beyond.
          </motion.p>
          
          {/* Search Bar */}
          <motion.form 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7, type: "spring", stiffness: 200 }}
            onSubmit={handleSearch} 
            className="rounded-2xl p-2 flex flex-col sm:flex-row shadow-2xl shadow-black/30 max-w-4xl mx-auto backdrop-blur-xl border border-white/30 bg-white/90 dark:bg-slate-900/90"
          >
            <div className="flex-grow flex items-center px-5 py-3.5 sm:py-4 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700">
              <Search className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Job title, skills, or keywords" 
                className="w-full focus:outline-none bg-transparent text-base text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            <div className="flex-grow flex items-center px-5 py-3.5 sm:py-4">
              <MapPin className="h-5 w-5 text-rose-500 dark:text-rose-400 mr-3 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="University or City" 
                className="w-full focus:outline-none bg-transparent text-base text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all mt-2 sm:mt-0 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/40 w-full sm:w-auto text-base"
            >
              Search
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.form>

          {/* Quick category pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-2 mt-8"
          >
            {['Research', 'Internship', 'Teaching Assistant', 'Field Work'].map((cat) => (
              <button
                key={cat}
                onClick={() => navigate('/opportunities')}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-105"
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L48 52.5C96 45 192 30 288 26.7C384 23.3 480 31.7 576 36.7C672 41.7 768 43.3 864 40C960 36.7 1056 28.3 1152 25C1248 21.7 1344 23.3 1392 24.2L1440 25V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" 
              className="fill-slate-50 dark:fill-slate-950"/>
          </svg>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {stats.map(({ icon: Icon, label, value, suffix, color, bg }) => (
              <motion.div
                key={label}
                variants={itemVariants}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all group hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${bg} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div className={`text-3xl font-extrabold ${color} mb-1 tabular-nums`}>
                  <Counter target={value} suffix={suffix} />
                </div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED OPPORTUNITIES SECTION ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">✦ Curated For You</p>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Featured Opportunities</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400">The latest prestigious roles from top universities.</p>
            </div>
            <Link to="/opportunities" className="hidden sm:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors group bg-indigo-50 dark:bg-indigo-900/20 px-5 py-2.5 rounded-xl border border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/40">
              Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 h-64 shimmer" />
              ))}
            </div>
          ) : featuredOpps.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-600">
              <Briefcase className="w-12 h-12 mx-auto mb-3" />
              <p className="font-semibold">No featured opportunities yet.</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid md:grid-cols-3 gap-6"
            >
              {featuredOpps.map(opp => {
                const gradientClass = categoryColors[opp.category] || 'from-indigo-500 to-violet-500';
                return (
                  <motion.div 
                    key={opp._id} 
                    variants={itemVariants}
                    whileHover={{ y: -6 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-950/30 transition-all group flex flex-col h-full overflow-hidden"
                  >
                    {/* Top gradient stripe */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${gradientClass}`} />
                    
                    <div className="p-7 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-5">
                        <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
                          {opp.category}
                        </span>
                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                          {opp.compensation?.type}
                        </span>
                      </div>
                      
                      <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                        {opp.title}
                      </h3>
                      
                      <div className="space-y-2.5 mb-6 text-sm text-slate-500 dark:text-slate-400 flex-grow">
                        <div className="flex items-center gap-2.5">
                          <Briefcase className="w-4 h-4 text-indigo-400 dark:text-indigo-500 flex-shrink-0" />
                          <span className="font-medium truncate">{opp.university?.name || opp.university}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
                          <span className="font-medium truncate">{opp.location?.city || 'Location N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <span className="font-medium">Deadline: {new Date(opp.applicationSettings.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <Link 
                        to={`/opportunities/${opp._id}`} 
                        className={`mt-auto flex justify-center items-center gap-2 w-full text-center py-3 rounded-xl font-bold transition-all border bg-gradient-to-r ${gradientClass} text-white opacity-90 hover:opacity-100 hover:shadow-lg`}
                      >
                        View Details <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/opportunities" className="inline-flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-4 rounded-xl shadow-md shadow-indigo-600/30">
              View all opportunities <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        <div className="dots-pattern absolute inset-0 opacity-60" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">✦ Simple Process</p>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">How It <span className="gradient-text">Works</span></h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Get started in under 5 minutes and connect with opportunities that match your goals.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-indigo-200 via-rose-200 to-emerald-200 dark:from-indigo-800/40 dark:via-rose-800/40 dark:to-emerald-800/40" />

            {howItWorks.map(({ step, title, desc, icon: Icon, color }) => (
              <motion.div
                key={step}
                variants={itemVariants}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-lg transition-all text-center group relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-black text-slate-400 dark:text-slate-600 px-3 py-1 rounded-full">
                  {step}
                </div>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${color} mb-6 mt-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">✦ Why UNITY</p>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Built for <span className="gradient-text">Academic Excellence</span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The premier ecosystem designed to accelerate academic collaboration and supercharge your research career.
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: MapPin, title: 'Location Discovery', desc: 'Find vital opportunities near your campus or explore global remote options using our interactive geospatial mapping engine.', iconColor: 'text-rose-500 dark:text-rose-400', accentBg: 'bg-rose-50 dark:bg-rose-900/10', accent: 'from-rose-500 to-pink-500' },
              { icon: Briefcase, title: 'Diverse Portfolio', desc: 'From highly competitive paid research assistantships to volunteer field work, find exactly the role that matches your academic trajectory.', iconColor: 'text-indigo-600 dark:text-indigo-400', accentBg: 'bg-indigo-50 dark:bg-indigo-900/10', accent: 'from-indigo-500 to-violet-500' },
              { icon: GraduationCap, title: 'Verified Network', desc: 'Connect with confidence. All faculty and students are verified directly through their official university credentials.', iconColor: 'text-emerald-600 dark:text-emerald-400', accentBg: 'bg-emerald-50 dark:bg-emerald-900/10', accent: 'from-emerald-500 to-teal-500' },
            ].map(({ icon: Icon, title, desc, iconColor, accentBg, accent }) => (
              <motion.div 
                key={title}
                variants={itemVariants} 
                className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-slate-950/30 transition-all group overflow-hidden relative"
              >
                {/* Bottom accent bar */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${accent} transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`} />
                
                <div className={`w-14 h-14 ${accentBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-7 w-7 ${iconColor}`} />
                </div>
                <h3 className="text-xl font-extrabold mb-3 text-slate-900 dark:text-white">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* ===== CTA SECTION ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-animated-gradient opacity-95" />
        <div className="dots-pattern absolute inset-0 opacity-20" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-rose-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-white text-sm font-semibold mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Join 2,800+ students already on UNITY
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold mb-6 text-white leading-tight"
          >
            Ready to accelerate<br />your academic career?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-light"
          >
            Join thousands of ambitious students and visionary researchers building the future with UNITY.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-10 py-4 rounded-xl font-extrabold transition-all shadow-2xl text-lg hover:bg-indigo-50">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/opportunities" className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/40 hover:border-white/70 text-white px-10 py-4 rounded-xl font-bold transition-all text-lg hover:bg-white/10 backdrop-blur-sm">
                Browse Opportunities
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

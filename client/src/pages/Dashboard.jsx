import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, Users, Clock, CheckCircle, XCircle, MapPin, ChevronRight, Search, TrendingUp, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [myPostedOpps, setMyPostedOpps] = useState([]);
  const [availableOpps, setAvailableOpps] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const oppsRes = await axios.get(`http://localhost:5000/api/opportunities`, config);
        const allOpps = oppsRes.data.data;
        
        const posted = allOpps.filter(opp => opp.postedBy._id === user._id || opp.postedBy === user._id);
        const available = allOpps.filter(opp => opp.postedBy._id !== user._id && opp.postedBy !== user._id && opp.status === 'Open');
        
        setMyPostedOpps(posted);
        setAvailableOpps(available);
        
        const appsRes = await axios.get(`http://localhost:5000/api/applications/student`, config);
        setApplications(appsRes.data.data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
      <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600 dark:border-amber-400" />
      <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading your dashboard...</p>
    </div>
  );

  const tabs = [
    { id: 'available', label: 'Available', count: availableOpps.length, icon: Briefcase },
    { id: 'posted', label: 'My Posted', count: myPostedOpps.length, icon: BarChart3 },
    { id: 'applications', label: 'My Applications', count: applications.length, icon: CheckCircle },
  ];

  const statCards = [
    { label: 'Available Opps', value: availableOpps.length, icon: Briefcase, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800/30' },
    { label: 'Posted Opps', value: myPostedOpps.length, icon: TrendingUp, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800/30' },
    { label: 'Applications', value: applications.length, icon: Users, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800/30' },
    { label: 'Accepted', value: applications.filter(a => a.status === 'Accepted').length, icon: CheckCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-100 dark:border-rose-800/30' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16 transition-colors duration-300">
      {/* Hero Banner */}
      <div className="bg-indigo-900 dark:bg-slate-900 text-white pt-12 pb-36 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-animated-gradient opacity-20" />
        <div className="dots-pattern absolute inset-0 opacity-15" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-violet-500 dark:from-amber-400 dark:to-orange-400 text-white dark:text-slate-900 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-2xl">
                {user.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-indigo-900 dark:border-slate-900" />
            </motion.div>
            <div>
              <p className="text-indigo-300 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Welcome back 👋</p>
              <h1 className="text-3xl font-extrabold text-white">{user.name}</h1>
              <p className="text-indigo-200 dark:text-slate-300 font-medium mt-0.5">
                <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-sm">{user.role}</span>
                {' '}• {user.university?.name || user.university}
              </p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link 
              to="/post-opportunity" 
              className="bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-6 py-3.5 rounded-xl font-bold flex items-center gap-2.5 transition-all shadow-xl hover:shadow-2xl border border-white/10 hover:bg-indigo-50 dark:hover:bg-slate-700"
            >
              <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center">
                <Plus className="h-4 w-4" />
              </div>
              Post New Opportunity
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 z-20">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {statCards.map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`bg-white dark:bg-slate-900 rounded-2xl border ${border} dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
              </div>
              <div className={`text-3xl font-extrabold ${color} mb-1 tabular-nums`}>{value}</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tab Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-1.5 flex gap-1.5 mb-6 hide-scrollbar overflow-x-auto"
        >
          {tabs.map(({ id, label, count, icon: Icon }) => (
            <button 
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-sm text-center transition-all flex items-center justify-center gap-2 ${
                activeTab === id 
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-600/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === id ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>{count}</span>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ---- Available Opportunities Tab ---- */}
          {activeTab === 'available' && (
            <motion.div 
              key="available"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {availableOpps.length === 0 ? (
                <EmptyState icon={Search} title="No opportunities available right now." sub="Check back later or explore all opportunities." action={{ label: 'Browse All', to: '/opportunities' }} />
              ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {availableOpps.map(opp => (
                    <OpportunityCard key={opp._id} opp={opp} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ---- My Posted Tab ---- */}
          {activeTab === 'posted' && (
            <motion.div 
              key="posted"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {myPostedOpps.length === 0 ? (
                <EmptyState icon={Briefcase} title="You haven't posted any opportunities yet." sub="Create your first opportunity to find great candidates." action={{ label: 'Post Now', to: '/post-opportunity' }} />
              ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {myPostedOpps.map(opp => (
                    <PostedCard key={opp._id} opp={opp} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ---- My Applications Tab ---- */}
          {activeTab === 'applications' && (
            <motion.div 
              key="applications"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {applications.length === 0 ? (
                <EmptyState icon={Briefcase} title="You haven't applied to any opportunities yet." sub="Browse available opportunities and submit your first application." action={{ label: 'Browse Opportunities', onClick: () => setActiveTab('available') }} />
              ) : (
                <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {applications.map(app => (
                      <ApplicationItem key={app._id} app={app} />
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ========= Sub-components ========= */

const OpportunityCard = ({ opp }) => (
  <motion.div 
    whileHover={{ y: -4 }} 
    className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg dark:hover:shadow-slate-950/30 transition-all group flex flex-col h-full overflow-hidden"
  >
    <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide">
          {opp.category}
        </span>
        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
          {opp.compensation?.type}
        </span>
      </div>
      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
        {opp.title}
      </h3>
      <div className="space-y-2 mb-5 text-sm text-slate-500 dark:text-slate-400 font-medium flex-grow">
        <div className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" /> <span className="truncate">{opp.university?.name || opp.university}</span></div>
        <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" /> <span className="truncate">{opp.location?.city || 'Location N/A'}</span></div>
      </div>
      <Link 
        to={`/opportunities/${opp._id}`} 
        className="mt-auto flex justify-center items-center gap-2 w-full text-center bg-slate-50 dark:bg-slate-800/60 group-hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 group-hover:text-white dark:group-hover:text-white py-2.5 rounded-xl font-bold transition-all"
      >
        Apply Now <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  </motion.div>
);

const PostedCard = ({ opp }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all flex flex-col h-full overflow-hidden group">
    <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide">
          {opp.category}
        </span>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide ${
          opp.status === 'Open' 
            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}>
          {opp.status}
        </span>
      </div>
      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{opp.title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 font-medium flex-grow">{opp.department}</p>
      
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
          <Users className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
          <span>{opp.applicantsCount || 0} Applicants</span>
        </div>
        <Link 
          to={`/opportunities/${opp._id}`} 
          className="text-indigo-600 dark:text-indigo-400 hover:text-white dark:hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 px-4 py-2 rounded-xl font-bold text-sm transition-all border border-indigo-100 dark:border-slate-700 flex items-center gap-1"
        >
          Manage <ChevronRight className="w-4 h-4"/>
        </Link>
      </div>
    </div>
  </div>
);

const ApplicationItem = ({ app }) => {
  const statusConfig = {
    'Applied': { bg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800', icon: Clock },
    'Under Review': { bg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800', icon: Clock },
    'Accepted': { bg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800', icon: CheckCircle },
    'Rejected': { bg: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800', icon: XCircle },
  };
  const config = statusConfig[app.status] || statusConfig['Applied'];
  const Icon = config.icon;

  return (
    <li className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link 
            to={`/opportunities/${app.opportunity._id}`} 
            className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors inline-flex items-center gap-2"
          >
            {app.opportunity.title} 
            <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all"/>
          </Link>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5"/>
            Applied on {new Date(app.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide border ${config.bg}`}>
          <Icon className="w-4 h-4" />
          {app.status}
        </span>
      </div>
    </li>
  );
};

const EmptyState = ({ icon: Icon, title, sub, action }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
  >
    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
      <Icon className="h-10 w-10 text-slate-300 dark:text-slate-600" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 mb-7 max-w-sm mx-auto">{sub}</p>
    {action && (
      action.to ? (
        <Link to={action.to} className="inline-flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20">
          {action.label}
        </Link>
      ) : (
        <button onClick={action.onClick} className="inline-flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20">
          {action.label}
        </button>
      )
    )}
  </motion.div>
);

export default Dashboard;

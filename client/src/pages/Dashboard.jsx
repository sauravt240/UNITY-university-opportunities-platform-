import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, Users, Clock, CheckCircle, XCircle, MapPin, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [myPostedOpps, setMyPostedOpps] = useState([]);
  const [availableOpps, setAvailableOpps] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available'); // 'available', 'posted', 'applications'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch all opportunities
        const oppsRes = await axios.get(`http://localhost:5000/api/opportunities`, config);
        const allOpps = oppsRes.data.data;
        
        // Filter opportunities
        const posted = allOpps.filter(opp => opp.postedBy._id === user._id || opp.postedBy === user._id);
        const available = allOpps.filter(opp => opp.postedBy._id !== user._id && opp.postedBy !== user._id && opp.status === 'Open');
        
        setMyPostedOpps(posted);
        setAvailableOpps(available);
        
        // Fetch student applications
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
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16 transition-colors duration-300">
      <div className="bg-indigo-900 text-white pt-12 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-animated-gradient opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-3xl font-extrabold shadow-xl border-4 border-white/20">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">{user.name}</h1>
              <p className="text-indigo-200 dark:text-indigo-300 font-medium text-lg">{user.role} • {user.university?.name || user.university}</p>
              <p className="text-indigo-300/80 dark:text-indigo-400/80 text-sm mt-1">{user.email}</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/post-opportunity" className="bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl w-full md:w-auto justify-center border border-white/10">
              <Plus className="h-5 w-5" /> Post New Opportunity
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 z-20">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 flex gap-2 mb-8 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('available')}
            className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl font-bold text-center transition-all ${activeTab === 'available' ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Available Opportunities
          </button>
          <button 
            onClick={() => setActiveTab('posted')}
            className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl font-bold text-center transition-all ${activeTab === 'posted' ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            My Posted Opportunities
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl font-bold text-center transition-all ${activeTab === 'applications' ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            My Applications
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'available' && (
            <motion.div 
              key="available"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {availableOpps.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <Search className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No opportunities available right now.</h3>
                  <p className="text-slate-500 dark:text-slate-400">Check back later or explore all opportunities.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {availableOpps.map(opp => (
                    <motion.div whileHover={{ y: -4 }} key={opp._id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-lg dark:hover:shadow-indigo-950/20 transition-all group flex flex-col h-full relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide">
                          {opp.category}
                        </span>
                        <span className="text-xs font-bold px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                          {opp.compensation?.type}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{opp.title}</h3>
                      <div className="space-y-2 mb-6 text-sm text-slate-600 dark:text-slate-400 font-medium flex-grow">
                        <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-indigo-400 dark:text-indigo-400" /> <span className="truncate">{opp.university?.name || opp.university}</span></div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-400 dark:text-rose-400" /> <span className="truncate">{opp.location?.city || 'Location N/A'}</span></div>
                      </div>
                      <Link to={`/opportunities/${opp._id}`} className="mt-auto flex justify-center items-center gap-2 w-full text-center bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 group-hover:text-white dark:group-hover:text-white px-4 py-3 rounded-xl font-bold transition-colors">
                        Apply Now <ChevronRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'posted' && (
            <motion.div 
              key="posted"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {myPostedOpps.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <Briefcase className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">You haven't posted any opportunities yet.</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">Create your first opportunity to find great candidates.</p>
                  <Link to="/post-opportunity" className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md inline-flex items-center gap-2">
                    <Plus className="h-5 w-5" /> Post Now
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {myPostedOpps.map(opp => (
                    <div key={opp._id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-amber-400 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide">
                          {opp.category}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide ${opp.status === 'Open' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          {opp.status}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-2 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{opp.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium flex-grow">{opp.department}</p>
                      
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                          <Users className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                          <span>{opp.applicantsCount || 0} Applicants</span>
                        </div>
                        <Link to={`/opportunities/${opp._id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-white dark:hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-indigo-100 dark:border-slate-700 flex items-center gap-1">
                          Manage <ChevronRight className="w-4 h-4"/>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'applications' && (
            <motion.div 
              key="applications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {applications.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <Briefcase className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">You haven't applied to any opportunities yet.</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">Browse available opportunities and submit your first application.</p>
                  <button onClick={() => setActiveTab('available')} className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md inline-flex items-center gap-2">
                    <Search className="h-5 w-5" /> Browse Opportunities
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 shadow-sm rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {applications.map(app => (
                      <li key={app._id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <Link to={`/opportunities/${app.opportunity._id}`} className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors inline-flex items-center gap-2">
                              {app.opportunity.title} <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all"/>
                            </Link>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
                              <Clock className="w-4 h-4"/> Applied on {new Date(app.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide shadow-sm border
                              ${app.status === 'Applied' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800' : 
                                app.status === 'Under Review' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800' :
                                app.status === 'Accepted' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800' :
                                'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800'}`}
                            >
                              {app.status === 'Applied' && <Clock className="w-4 h-4" />}
                              {app.status === 'Accepted' && <CheckCircle className="w-4 h-4" />}
                              {app.status === 'Rejected' && <XCircle className="w-4 h-4" />}
                              {app.status}
                            </span>
                          </div>
                        </div>
                      </li>
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

export default Dashboard;

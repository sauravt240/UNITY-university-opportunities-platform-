import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, DollarSign, GraduationCap, CheckCircle, ArrowLeft, Upload, Building, Tag, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OpportunityDetails = () => {
  const { id } = useParams();
  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ coverNote: '', file: null });
  const [applyStatus, setApplyStatus] = useState('');

  useEffect(() => {
    const fetchOpp = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/opportunities/${id}`);
        setOpp(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpp();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyStatus('submitting');
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('coverNote', applyForm.coverNote);
      if (applyForm.file) formData.append('resume', applyForm.file);

      await axios.post(`http://localhost:5000/api/applications/${id}`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setApplyStatus('success');
      setTimeout(() => setShowApplyModal(false), 2000);
    } catch (err) {
      setApplyStatus('error');
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
    </div>
  );
  if (!opp) return <div className="p-8 text-center mt-20 text-rose-500 font-bold text-2xl">Opportunity not found.</div>;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16 transition-colors duration-300">
      <div className="bg-indigo-900 text-white pt-8 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-animated-gradient opacity-20"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/opportunities" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white mb-8 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" /> Back to explore
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 z-20">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden mb-8"
        >
          {/* Header Section */}
          <div className="p-8 sm:p-10 border-b border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Tag className="w-3 h-3" /> {opp.category}
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 ${opp.status === 'Open' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                    <CheckCircle className="w-3 h-3" /> {opp.status}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">{opp.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 mt-4 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-50 dark:bg-indigo-950/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400"><Building className="w-5 h-5" /></div>
                    <span className="text-base">{opp.university?.name || opp.university}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-rose-50 dark:bg-rose-950/30 p-2 rounded-lg text-rose-500 dark:text-rose-400"><MapPin className="w-5 h-5" /></div>
                    <span className="text-base">{opp.location?.city || 'Location N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-4 shrink-0 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-center">
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">Application Deadline</div>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5" />
                    {new Date(opp.applicationSettings.deadline).toLocaleDateString()}
                  </div>
                </div>
                
                {user && user.role === 'Student' ? (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowApplyModal(true)}
                    disabled={opp.status !== 'Open'}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed w-full text-center flex justify-center items-center gap-2 text-lg"
                  >
                    {opp.status === 'Open' ? <>Apply Now <ChevronRight className="w-5 h-5"/></> : 'Closed'}
                  </motion.button>
                ) : user && user._id === (opp.postedBy._id || opp.postedBy) ? (
                  <Link to={`/dashboard`} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg w-full text-center flex justify-center items-center text-lg">
                    Manage Applicants
                  </Link>
                ) : !user ? (
                  <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg w-full text-center flex justify-center items-center text-lg">
                    Login to Apply
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 sm:p-10 grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-12">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> About the Role
                </h2>
                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-400">
                  <p className="whitespace-pre-wrap">{opp.description}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-emerald-500 dark:text-emerald-400" /> Required Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-3">
                  {opp.requirements?.skills?.map((skill, i) => (
                    <span key={i} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6 text-lg tracking-tight">Opportunity Overview</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="bg-emerald-100 dark:bg-emerald-950/40 p-2.5 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Compensation</div>
                      <div className="font-bold text-slate-900 dark:text-white text-lg">{opp.compensation?.type}</div>
                      {opp.compensation?.amount && <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{opp.compensation.amount}</div>}
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-950/40 p-2.5 rounded-lg text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Min. Qualification</div>
                      <div className="font-bold text-slate-900 dark:text-white text-lg">{opp.requirements?.minQualification || 'Any'}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-purple-100 dark:bg-purple-950/40 p-2.5 rounded-lg text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Department</div>
                      <div className="font-bold text-slate-900 dark:text-white text-lg">{opp.department}</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <h3 className="font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider mb-3">Posted By</h3>
                <p className="font-extrabold text-slate-900 dark:text-white text-xl mb-1">{opp.postedBy.name}</p>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-1.5">
                  <Building className="w-4 h-4"/> {opp.postedBy.department}
                </p>
                {opp.postedBy.bio && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">"{opp.postedBy.bio}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-white/20 dark:border-slate-800"
            >
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-100 dark:bg-indigo-950 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white relative z-10">Submit Application</h3>
                <button onClick={() => setShowApplyModal(false)} className="relative z-10 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              
              <div className="p-8">
                {applyStatus === 'success' ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-3">Application Submitted!</h4>
                    <p className="text-slate-600 text-lg">The faculty has been notified. Track your status in your Dashboard.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleApply}>
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Cover Note <span className="text-rose-500">*</span></label>
                      <textarea 
                        required rows="4" 
                        placeholder="Why are you the perfect fit for this role?"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm resize-none text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={applyForm.coverNote}
                        onChange={e => setApplyForm({...applyForm, coverNote: e.target.value})}
                      ></textarea>
                    </div>
                    
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Upload Resume (Optional)</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-xl hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors group cursor-pointer">
                        <div className="space-y-2 text-center">
                          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-500 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 transition-colors">
                            <Upload className="h-6 w-6" />
                          </div>
                          <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                            <label className="relative cursor-pointer rounded-md font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                              <span>Choose a file</span>
                              <input type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={e => setApplyForm({...applyForm, file: e.target.files[0]})} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-500">{applyForm.file ? <span className="text-indigo-600 dark:text-indigo-400">{applyForm.file.name}</span> : 'PDF, DOC up to 5MB'}</p>
                        </div>
                      </div>
                    </div>

                    {applyStatus === 'error' && (
                      <div className="mb-6 text-rose-600 text-sm font-medium bg-rose-50 p-4 rounded-xl border border-rose-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500"></div> Failed to submit. You may have already applied.
                      </div>
                    )}

                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button type="button" onClick={() => setShowApplyModal(false)} className="px-6 py-3 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors">
                        Cancel
                      </button>
                      <button type="submit" disabled={applyStatus === 'submitting'} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                        {applyStatus === 'submitting' ? (
                          <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> Submitting...</>
                        ) : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpportunityDetails;

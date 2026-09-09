import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostOpportunity = () => {
  const [formData, setFormData] = useState({
    title: '', category: 'Research', department: '', description: '',
    location: { city: '', state: '', country: '' },
    compensation: { type: 'Unpaid', amount: '' },
    requirements: { minQualification: 'Any', skills: '' },
    applicationSettings: { deadline: '' }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // format skills
      const payload = { ...formData };
      if (typeof payload.requirements.skills === 'string') {
        payload.requirements.skills = payload.requirements.skills.split(',').map(s => s.trim());
      }

      await axios.post('http://localhost:5000/api/opportunities', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post opportunity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">Post New Opportunity</h1>
      
        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl mb-6 border border-rose-200 dark:border-rose-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500"></div> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">Basic Info</h2>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Title</label>
            <input 
              type="text" required 
              placeholder="e.g. Senior Research Assistant"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400" 
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Category</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white font-medium" 
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {['Research', 'Internship', 'Project', 'Teaching Assistant'].map(c => <option key={c} value={c} className="dark:bg-slate-900">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Department</label>
              <input 
                type="text" required 
                placeholder="e.g. Computer Science"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400" 
                value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Description</label>
            <textarea 
              required rows="4" 
              placeholder="Detailed description of the opportunity..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 resize-none" 
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">City</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400" value={formData.location.city} onChange={e => setFormData({...formData, location: {...formData.location, city: e.target.value}})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">State</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400" value={formData.location.state} onChange={e => setFormData({...formData, location: {...formData.location, state: e.target.value}})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Country</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400" value={formData.location.country} onChange={e => setFormData({...formData, location: {...formData.location, country: e.target.value}})} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">Requirements & Compensation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Required Skills (comma separated)</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400" placeholder="e.g. React, Python, Data Analysis" value={formData.requirements.skills} onChange={e => setFormData({...formData, requirements: {...formData.requirements, skills: e.target.value}})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Application Deadline</label>
              <input type="date" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white" value={formData.applicationSettings.deadline} onChange={e => setFormData({...formData, applicationSettings: {...formData.applicationSettings, deadline: e.target.value}})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Compensation Type</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white font-medium" 
                value={formData.compensation.type} onChange={e => setFormData({...formData, compensation: {...formData.compensation, type: e.target.value}})}
              >
                {['Unpaid', 'Stipend', 'Full Salary', 'Academic Credit'].map(c => <option key={c} value={c} className="dark:bg-slate-900">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Amount (if applicable)</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400" placeholder="e.g. $500/month" value={formData.compensation.amount} onChange={e => setFormData({...formData, compensation: {...formData.compensation, amount: e.target.value}})} />
            </div>
          </div>
        </div>

        <div className="pt-8 flex justify-end">
          <button 
            type="submit" disabled={loading} 
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-70 uppercase tracking-widest text-sm"
          >
            {loading ? 'Posting...' : 'Post Opportunity'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default PostOpportunity;

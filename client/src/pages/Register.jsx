import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, GraduationCap, Sparkles, Briefcase, MapPin, CheckCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Student', university: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.university.trim()) {
      setError('Please enter your university name.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Briefcase, text: 'Apply to 500+ exclusive research & internship roles' },
    { icon: MapPin, text: 'Discover opportunities near your campus' },
    { icon: CheckCircle, text: 'Get verified by your university instantly' },
  ];

  const inputClass = "block w-full px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 placeholder-slate-400 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all text-sm shadow-sm";
  const labelClass = "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2";

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {/* ===== LEFT PANEL — Branding ===== */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12">
        {/* Animated gradient */}
        <div className="absolute inset-0 bg-animated-gradient" />
        <div className="dots-pattern absolute inset-0 opacity-20" />

        {/* Blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/25 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-500/15 rounded-full blur-3xl animate-blob animation-delay-4000" />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <GraduationCap className="h-9 w-9 text-white drop-shadow-lg" />
            <span className="font-extrabold text-3xl text-white tracking-tight drop-shadow">UNITY</span>
          </Link>
        </div>

        {/* Main copy */}
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-white text-sm font-semibold mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Free forever for students
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Join the smartest academic network.
            </h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              Create your free account and unlock access to hundreds of research positions, internships, and academic projects tailored to you.
            </p>

            <div className="space-y-4">
              {benefits.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/85 font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {['A','B','C','D'].map((l, i) => (
                  <div key={l} className="w-9 h-9 rounded-full border-2 border-white/30 flex items-center justify-center text-xs font-extrabold text-white"
                    style={{ background: ['#6366f1','#f43f5e','#10b981','#f59e0b'][i] }}>
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-white/70 text-sm font-medium">
                <span className="text-white font-extrabold">2,800+</span> students already joined
              </p>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-sm">© 2026 UNITY Academic Platform</p>
        </div>
      </div>

      {/* ===== RIGHT PANEL — Form ===== */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-14 relative overflow-hidden">
        {/* Mobile bg blobs */}
        <div className="lg:hidden absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob" />
        <div className="lg:hidden absolute bottom-1/3 left-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-2000" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-amber-400" />
            <span className="font-extrabold text-2xl gradient-text">UNITY</span>
          </div>

          <div className="mb-7">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Create your account</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 p-4 rounded-xl text-sm font-medium border border-rose-200 dark:border-rose-800 mb-5 flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label htmlFor="name" className={labelClass}>Full Name</label>
              <input
                id="name" name="name" type="text" required
                className={inputClass}
                placeholder="Dr. Jane Smith"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* University Email */}
            <div>
              <label htmlFor="email" className={labelClass}>University Email</label>
              <input
                id="email" name="email" type="email" required
                className={inputClass}
                placeholder="name@university.edu"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelClass}>Password</label>
              <div className="relative">
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'} required minLength="6"
                  className={`${inputClass} pr-12`}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Role + University side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="role" className={labelClass}>I am a</label>
                <div className="relative">
                  <select
                    id="role" name="role"
                    className={`${inputClass} appearance-none cursor-pointer pr-9`}
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Student" className="dark:bg-slate-900">Student</option>
                    <option value="Faculty" className="dark:bg-slate-900">Faculty</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="university" className={labelClass}>University</label>
                <input
                  id="university" name="university" type="text" required
                  className={inputClass}
                  placeholder="e.g. Stanford"
                  value={formData.university}
                  onChange={handleChange}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2.5 py-4 px-4 text-sm font-bold rounded-xl text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-70 mt-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-7 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-center text-xs text-slate-400 dark:text-slate-600">
              By creating an account, you agree to UNITY's{' '}
              <a href="#" className="underline hover:text-indigo-500 transition-colors">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-indigo-500 transition-colors">Privacy Policy</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

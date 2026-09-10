import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, Menu, User, Briefcase, X, Sun, Moon, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  const isAuthenticated = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Scroll-aware shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Explore', path: '/opportunities', icon: Briefcase },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: '/dashboard', icon: User }] : [])
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-slate-900/5 dark:shadow-slate-900/30 border-b border-slate-200/60 dark:border-slate-800/60' 
        : 'glass-effect border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ 
                  rotate: 15, 
                  scale: 1.15,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-indigo-500/30 dark:bg-amber-400/30 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
                <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-amber-400 relative z-10" />
              </motion.div>
              <span className="font-extrabold text-2xl tracking-tight gradient-text">
                UNITY
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`relative flex items-center gap-1.5 font-semibold text-sm px-3 py-2 rounded-lg transition-all ${
                    isActive(link.path) 
                      ? 'text-indigo-600 dark:text-amber-400 bg-indigo-50 dark:bg-amber-400/10' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-amber-400 hover:bg-indigo-50/50 dark:hover:bg-amber-400/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-2 right-2 h-0.5 bg-indigo-600 dark:bg-amber-400 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-2" />
            
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-1">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-amber-400 text-white dark:text-slate-900 flex items-center justify-center font-extrabold text-sm shadow">
                  {user.name?.charAt(0)}
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 border border-rose-100 dark:border-rose-800/50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link 
                  to="/login" 
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-amber-400 font-semibold px-3 py-2 text-sm transition-colors rounded-lg hover:bg-indigo-50/50 dark:hover:bg-slate-800/50"
                >
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link 
                    to="/register" 
                    className="bg-indigo-600 dark:bg-amber-400 hover:bg-indigo-700 dark:hover:bg-amber-300 text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-indigo-200 dark:shadow-amber-900/20"
                  >
                    Sign Up Free
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-amber-400 focus:outline-none p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileMenuOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="sm:hidden bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-5 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                      isActive(link.path) 
                        ? 'bg-indigo-50 dark:bg-amber-400/10 text-indigo-600 dark:text-amber-400' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {link.name}
                  </Link>
                );
              })}
              
              {!isAuthenticated ? (
                <div className="pt-4 flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                  <Link 
                    to="/login"
                    className="flex justify-center items-center px-4 py-3 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="flex justify-center items-center px-4 py-3 rounded-xl text-base font-bold text-white dark:text-slate-900 bg-indigo-600 dark:bg-amber-400 hover:bg-indigo-700 dark:hover:bg-amber-300 shadow-sm transition-colors"
                  >
                    Sign Up Free
                  </Link>
                </div>
              ) : (
                <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 dark:bg-amber-400 text-white dark:text-slate-900 flex items-center justify-center font-extrabold shadow">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors border border-rose-100 dark:border-rose-800/50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Menu, X, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl text-slate-900 tracking-tight">Student Freelance Hub</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/jobs" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">Jobs</Link>

            {user ? (
              <>
                <Link
                  to={user.role === 'client' ? '/client-dashboard' : '/student-dashboard'}
                  className="text-slate-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-full">
                    <UserIcon size={16} className="text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-all"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 hover:text-slate-700 p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg absolute top-full w-full left-0 z-50">
          <div className="px-4 pt-2 pb-4 space-y-1 shadow-inner">
            <Link
              to="/jobs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50"
            >
              Jobs
            </Link>

            {user ? (
              <>
                <Link
                  to={user.role === 'client' ? '/client-dashboard' : '/student-dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50"
                >
                  Dashboard
                </Link>
                <div className="px-3 py-3 border-t border-slate-100 mt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-slate-100 p-2 rounded-full">
                      <UserIcon size={20} className="text-slate-500" />
                    </div>
                    <span className="font-medium text-slate-700">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
                  >
                    <LogOut size={18} />
                    Log out
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-slate-100 pt-3 mt-2 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-md transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

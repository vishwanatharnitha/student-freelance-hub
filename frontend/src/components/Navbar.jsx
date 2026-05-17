import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Menu, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50">
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
            <button className="text-slate-500 hover:text-slate-700 p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

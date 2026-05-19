import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Clock, Briefcase, Filter, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Apply Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get('/jobs');
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setApplyLoading(true);
    setApplyError('');

    try {
      await API.post(`/jobs/${selectedJob._id}/apply`, { coverLetter });
      setApplySuccess(true);
      setTimeout(() => {
        setSelectedJob(null);
        setApplySuccess(false);
        setCoverLetter('');
      }, 2000);
    } catch (error) {
      setApplyError(error.response?.data?.message || 'Error applying for job');
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Search */}
        <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 sm:mb-4 tracking-tight">Find Freelance Work</h1>
          <p className="text-slate-600 mb-6 sm:mb-8 text-base sm:text-lg">Browse thousands of opportunities perfect for students.</p>

          <div className="relative flex items-center w-full max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 border-none rounded-2xl leading-5 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-900 transition-all text-base"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <motion.div
                key={job._id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold text-xl">
                    {job.client?.name?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  <span className="bg-primary-50 text-primary-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    {job.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{job.title}</h3>

                <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4 text-sm font-medium text-slate-600">
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} className="text-slate-400" />
                    <span>${job.budget}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-slate-400" />
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow">
                  {job.description}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    By {job.client?.name || 'Unknown Client'}
                  </span>
                  <button
                    onClick={() => {
                      if (!user) {
                        navigate('/login');
                      } else if (user.role === 'student') {
                        setSelectedJob(job);
                      }
                    }}
                    disabled={user?.role === 'client'}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${user?.role === 'client'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/20 hover:shadow-lg'
                      }`}
                  >
                    {user?.role === 'client' ? 'Clients cannot apply' : 'Apply Now'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No jobs found matching your search.</p>
          </div>
        )}
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-[95%] sm:w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Apply for Job</h2>
                  <p className="text-slate-500 mt-1">{selectedJob.title}</p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors"
                >
                  &times;
                </button>
              </div>

              {applySuccess ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Application Submitted!</h3>
                  <p className="text-slate-500 mt-2">The client will review your application soon.</p>
                </div>
              ) : (
                <form onSubmit={handleApply}>
                  {applyError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                      {applyError}
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Letter</label>
                    <textarea
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none resize-none"
                      placeholder="Why are you the best fit for this job? Mention relevant skills and past projects..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(null)}
                      className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={applyLoading}
                      className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl shadow-md hover:bg-primary-700 hover:shadow-lg disabled:opacity-70 transition-all"
                    >
                      {applyLoading ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Assuming CheckCircle isn't imported above
import { CheckCircle } from 'lucide-react';

export default Jobs;

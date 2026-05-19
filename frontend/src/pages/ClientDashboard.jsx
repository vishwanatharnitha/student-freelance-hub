import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { motion } from 'framer-motion';
import { Plus, Briefcase, DollarSign, Tag, Users } from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Post Job Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
  });

  useEffect(() => {
    fetchMyJobs();
  }, [user._id]);

  const fetchMyJobs = async () => {
    try {
      // In a real app, there would be a dedicated endpoint for "my posted jobs"
      // Here we filter all jobs by the client's ID since we only have a global getJobs right now
      const { data } = await API.get('/jobs');
      const myJobs = data.filter(job => job.client?._id === user._id);
      setJobs(myJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await API.post('/jobs', {
        ...formData,
        budget: Number(formData.budget),
      });
      setShowForm(false);
      setFormData({ title: '', description: '', budget: '', category: '' });
      fetchMyJobs();
    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, {user.name}</h1>
          <p className="text-slate-500">Manage your posted jobs and find great student talent.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          {showForm ? 'Cancel' : <><Plus size={20} /> Post New Job</>}
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8 overflow-hidden"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">Post a New Job</h2>
          <form onSubmit={handlePostJob} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                  placeholder="e.g. React Native Developer for MVP"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                  placeholder="e.g. Web Development"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Budget ($)</label>
              <input
                type="number"
                required
                min="5"
                className="w-full md:w-1/2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                placeholder="500"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description</label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none resize-none"
                placeholder="Describe the project requirements, deliverables, and timeline..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-primary-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all"
              >
                Publish Job
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <h2 className="text-xl font-bold text-slate-900 mb-6">Your Posted Jobs</h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No jobs posted yet</h3>
          <p className="text-slate-500 mb-6">Post your first job to start receiving applications from students.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary-50 text-primary-700 px-6 py-2.5 rounded-xl font-medium hover:bg-primary-100 transition-colors"
          >
            Post a Job
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-900 line-clamp-1" title={job.title}>{job.title}</h3>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {job.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mb-5 text-sm text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <DollarSign size={16} className="text-slate-400" />
                  <span className="font-semibold text-slate-700">${job.budget}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Tag size={16} className="text-slate-400" />
                  <span className="font-medium text-slate-700">{job.category}</span>
                </div>
              </div>

              <p className="text-slate-600 text-sm line-clamp-2 mb-6">
                {job.description}
              </p>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Users size={16} />
                  <span>View applicants</span>
                </div>
                <button className="text-primary-600 font-medium hover:text-primary-700 text-sm">
                  Manage Job &rarr;
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;

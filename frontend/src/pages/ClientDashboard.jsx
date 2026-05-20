import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { motion } from 'framer-motion';
import { Plus, Briefcase, DollarSign, Tag, Users } from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');

  // Applications Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  // Post Job Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
  });

  useEffect(() => {
    fetchMyJobsAndOrders();
  }, [user._id]);

  const fetchMyJobsAndOrders = async () => {
    try {
      const [jobsRes, ordersRes] = await Promise.all([
        API.get('/jobs').catch(() => ({ data: [] })),
        API.get('/orders/my-orders').catch(() => ({ data: [] }))
      ]);
      const myJobs = jobsRes.data.filter(job => job.client?._id === user._id);
      setJobs(myJobs);
      setOrders(ordersRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
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
      fetchMyJobsAndOrders();
    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  const handleViewApplications = async (job) => {
    setSelectedJob(job);
    setAppsLoading(true);
    try {
      const { data } = await API.get(`/jobs/${job._id}/applications`);
      setJobApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setAppsLoading(false);
    }
  };

  const handleUpdateAppStatus = async (appId, status) => {
    try {
      await API.put(`/jobs/applications/${appId}`, { status });
      // Update local state
      setJobApplications(jobApplications.map(app =>
        app._id === appId ? { ...app, status } : app
      ));
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update status.');
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

      <div className="flex space-x-6 border-b border-slate-200 mb-6 mt-8">
        <button
          className={`pb-4 text-lg font-bold transition-colors ${activeTab === 'jobs' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-800'}`}
          onClick={() => setActiveTab('jobs')}
        >
          Your Posted Jobs
        </button>
        <button
          className={`pb-4 text-lg font-bold transition-colors ${activeTab === 'orders' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-800'}`}
          onClick={() => setActiveTab('orders')}
        >
          Gig Orders
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : activeTab === 'jobs' ? (
        jobs.length === 0 ? (
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
                  <button
                    onClick={() => handleViewApplications(job)}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition-colors"
                  >
                    <Users size={16} />
                    <span>View applicants</span>
                  </button>
                  <button
                    onClick={() => handleViewApplications(job)}
                    className="text-primary-600 font-medium hover:text-primary-700 text-sm transition-colors"
                  >
                    Manage Job &rarr;
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No gig orders yet</h3>
            <p className="text-slate-500 mb-6">You haven't ordered any student gigs.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{order.gig?.title || 'Gig Deleted'}</h3>
                    <p className="text-slate-500 text-sm mt-1">Purchased from {order.seller?.name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold text-slate-900">${order.price}</span>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium border capitalize ${order.status === 'completed' ? 'text-green-600 bg-green-50 border-green-200' :
                        order.status === 'rejected' ? 'text-red-600 bg-red-50 border-red-200' :
                          'text-amber-600 bg-amber-50 border-amber-200'
                      }`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Applications Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
          >
            <div className="p-6 md:px-8 md:pt-8 md:pb-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">Applications</h2>
                <p className="text-slate-500 mt-1 font-medium">{selectedJob.title}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-all border border-slate-200 shadow-sm"
              >
                &times;
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto flex-grow bg-slate-50">
              {appsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                </div>
              ) : jobApplications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                  <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-lg font-medium">No applications received yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobApplications.map((app) => (
                    <div key={app._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 text-primary-700 font-bold rounded-full flex items-center justify-center text-lg">
                            {app.student?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{app.student?.name}</h4>
                            <p className="text-xs text-slate-500">{app.student?.email}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                          }`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl mb-5 text-sm text-slate-700 whitespace-pre-wrap border border-slate-100">
                        {app.coverLetter}
                      </div>

                      {app.status === 'pending' && (
                        <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleUpdateAppStatus(app._id, 'rejected')}
                            className="px-5 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-xl transition-colors text-sm"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleUpdateAppStatus(app._id, 'accepted')}
                            className="px-5 py-2 bg-green-600 text-white hover:bg-green-700 font-semibold rounded-xl shadow-md shadow-green-600/20 transition-all text-sm"
                          >
                            Accept Application
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;

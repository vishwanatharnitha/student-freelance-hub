import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { motion } from 'framer-motion';
import { Briefcase, User, Mail, PlusCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, ordersRes] = await Promise.all([
          API.get('/jobs/my-applications'),
          API.get('/orders/my-orders').catch(() => ({ data: [] }))
        ]);
        setApplications(appsRes.data);
        setOrders(ordersRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-amber-600 bg-amber-50 border-amber-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-primary-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-slate-500 flex items-center gap-1 mt-1 text-sm">
                <Mail size={14} /> {user?.email}
              </p>

              <div className="w-full mt-6 pt-6 border-t border-slate-100 text-left">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <User size={16} /> Bio
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {user?.bio || "No bio added yet. Add a bio to stand out to clients!"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8">
            <div className="flex space-x-6 border-b border-slate-200 mb-6">
              <button
                className={`pb-4 text-lg font-bold transition-colors ${activeTab === 'applications' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-800'}`}
                onClick={() => setActiveTab('applications')}
              >
                Applications
              </button>
              <button
                className={`pb-4 text-lg font-bold transition-colors ${activeTab === 'orders' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-800'}`}
                onClick={() => setActiveTab('orders')}
              >
                Orders (Gigs)
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : activeTab === 'applications' ? (
              applications.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">No applications yet</h3>
                  <p className="text-slate-500">You haven't applied to any jobs.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <motion.div
                      key={app._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow bg-slate-50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{app.job?.title || 'Job Deleted'}</h3>
                          <p className="text-slate-500 text-sm mt-1">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)}
                          <span className="capitalize">{app.status}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              orders.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">No orders yet</h3>
                  <p className="text-slate-500">You haven't placed or received any gig orders.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow bg-slate-50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{order.gig?.title || 'Gig Deleted'}</h3>
                          <p className="text-slate-500 text-sm mt-1">
                            {order.buyer?._id === user._id
                              ? `Purchased from ${order.seller?.name}`
                              : `Ordered by ${order.buyer?.name}`}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-bold text-slate-900">${order.price}</span>
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Loader2, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Gigs = () => {
  const { user } = useContext(AuthContext);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Design',
    price: '',
    skills: ''
  });

  const categories = ['All', 'Design', 'Coding', 'Writing', 'Editing', 'Tutoring', 'Other'];

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const baseUrl = category && category !== 'All' 
        ? `/gigs?category=${category}`
        : `/gigs`;
        
      const url = baseUrl + (baseUrl.includes('?') ? '&' : '?') + `t=${new Date().getTime()}`;
      
      const { data } = await API.get(url);
      setGigs(data.gigs);
      setError(null);
    } catch (err) {
      setError('Failed to load gigs. Please try again later.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGigs();
  }, [category]);

  const handlePostGig = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.category || !formData.price || Number(formData.price) <= 0) {
      alert('Please fill out all required fields with valid information.');
      return;
    }

    setSubmitLoading(true);
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);

      const { data } = await API.post('/gigs', {
        ...formData,
        price: Number(formData.price),
        skills: skillsArray
      });

      setShowForm(false);
      setFormData({ title: '', description: '', category: 'Design', price: '', skills: '' });
      setGigs([data, ...gigs]);
      fetchGigs();
    } catch (err) {
      console.error('Error posting gig:', err);
      alert('Failed to post gig. Please try again.');
    }
    setSubmitLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Freelance Gigs</h1>
          <p className="text-slate-600">Find affordable services offered by talented students.</p>
        </div>

        {user && (user.role === 'student' || user.role === 'client') && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            {showForm ? <><X size={20} /> Cancel</> : <><Plus size={20} /> Post a Gig</>}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 40 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Create a New Gig</h2>
              <form onSubmit={handlePostGig} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Gig Title</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                      placeholder="e.g. I will design a modern logo"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                      placeholder="15"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Skills (comma separated)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                      placeholder="e.g. React, Node.js, Figma"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none resize-none"
                    placeholder="Describe exactly what you will deliver..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="bg-primary-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all disabled:opacity-70 flex items-center justify-center min-w-[140px]"
                  >
                    {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Gig'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-4 w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search gigs..."
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all w-full md:w-64"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${(category === c || (!category && c === 'All'))
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center">
          {error}
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No gigs found</h3>
          <p className="text-slate-500">Try adjusting your filters or category selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gigs.filter(gig => gig.seller && gig.title && gig.price).map((gig, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={gig._id}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full">
                    {gig.category}
                  </span>
                  <span className="font-bold text-lg text-slate-900">${gig.price}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {gig.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                  {gig.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {(gig.skills || []).slice(0, 3).map((skill, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">
                      {skill}
                    </span>
                  ))}
                  {(gig.skills || []).length > 3 && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">
                      +{(gig.skills || []).length - 3}
                    </span>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <Link to={gig.seller?._id ? `/profile/${gig.seller._id}` : '#'} className="flex items-center gap-3 group/user">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold overflow-hidden border-2 border-white shadow-sm group-hover/user:border-primary-200 transition-all">
                    {gig.seller?.avatar ? (
                      <img src={gig.seller.avatar} alt={gig.seller?.name || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      (gig.seller?.name || 'U').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 group-hover/user:text-primary-600 transition-colors">
                      {gig.seller?.name || 'Unknown User'}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{gig.seller?.rating || 'New'}</span>
                    </div>
                  </div>
                </Link>
                <Link
                  to={`/gigs/${gig._id}`}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 text-sm font-bold rounded-xl transition-colors shadow-sm shadow-primary-500/20"
                >
                  Order Gig
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gigs;

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Star, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import API from '../services/api';

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/gigs/${id}`);
        setGig(data);
      } catch (err) {
        setError('Failed to load gig details.');
      }
      setLoading(false);
    };
    fetchGig();
  }, [id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setOrderLoading(true);
    setOrderError(null);
    try {
      await API.post('/orders/create', { gigId: id, notes });
      setOrderSuccess(true);
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to place order.');
    }
    setOrderLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-2xl flex flex-col items-center">
          <AlertCircle className="h-12 w-12 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/gigs')} className="mt-6 text-primary-600 font-medium hover:underline">
            Back to Gigs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/gigs')} 
        className="flex items-center text-slate-500 hover:text-slate-800 font-medium mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Gigs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <span className="px-4 py-1.5 bg-primary-50 text-primary-700 text-sm font-semibold rounded-full">
                {gig.category}
              </span>
              <span className="text-3xl font-bold text-slate-900">${gig.price}</span>
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-6">{gig.title}</h1>
            
            <div className="prose prose-slate max-w-none mb-8">
              <h3 className="text-xl font-semibold mb-3">About this gig</h3>
              <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{gig.description}</p>
            </div>

            {gig.skills && gig.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {gig.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6">About the Seller</h3>
            <Link to={gig.seller?._id ? `/profile/${gig.seller._id}` : '#'} className="flex items-center gap-4 mb-6 group">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl overflow-hidden border-2 border-white shadow-md group-hover:border-primary-200 transition-all">
                {gig.seller?.avatar ? (
                  <img src={gig.seller.avatar} alt={gig.seller?.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  (gig.seller?.name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">
                  {gig.seller?.name || 'Unknown User'}
                </p>
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium text-slate-700">{gig.seller?.rating || '0.0'}</span>
                  <span>({gig.seller?.ratingsCount || 0} reviews)</span>
                </div>
              </div>
            </Link>

            <div className="border-t border-slate-100 pt-6">
              <h4 className="font-semibold text-slate-900 mb-4">Order Details</h4>
              {orderSuccess ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Order placed successfully!</p>
                    <p className="text-sm mt-1">You can track this in your dashboard.</p>
                  </div>
                </div>
              ) : gig.seller?._id === user?._id ? (
                <div className="bg-slate-50 text-slate-600 p-4 rounded-xl text-center font-medium">
                  This is your own gig.
                </div>
              ) : (
                <form onSubmit={handleOrder} className="space-y-4">
                  {orderError && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {orderError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Requirements / Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                      rows="3"
                      placeholder="Briefly describe what you need..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={orderLoading}
                    className="w-full bg-primary-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-primary-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {orderLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Order for $${gig.price}`}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;

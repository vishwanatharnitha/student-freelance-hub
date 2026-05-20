import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, Mail, Award, Loader2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null); // Not implementing an explicit GET /user route yet, so we'll fetch gigs to infer profile data for now
  const [userGigs, setUserGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We don't have a specific get user profile API in the plan yet, 
    // but we can fetch gigs filtered by seller to get seller info if needed,
    // or just assume a simple profile fetch if the backend had it.
    // Let's implement a quick fetch for gigs by this seller to populate the page.
    const fetchProfileAndGigs = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/gigs?seller=${id}`); 
        // We need to fetch user separately, wait, I didn't create a GET /users/:id endpoint.
        // Let's use the gigs data if available, otherwise it's just a placeholder.
        // For a true profile, we'd need a user endpoint. Let's mock the user data from the first gig.
        if (data.gigs && data.gigs.length > 0) {
            setProfileData(data.gigs[0].seller);
        }
        setUserGigs(data.gigs || []);
      } catch (err) {
        setError('Failed to load profile.');
      }
      setLoading(false);
    };

    fetchProfileAndGigs();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error && !profileData) {
     return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-2xl flex flex-col items-center">
          <AlertCircle className="h-12 w-12 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
          <p>We couldn't load this user's profile.</p>
        </div>
      </div>
    );
  }

  // Fallback if user has no gigs
  const user = profileData || { name: 'Unknown User', rating: 0, ratingsCount: 0 };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-8">
        <div className="h-32 sm:h-48 bg-gradient-to-r from-primary-600 to-primary-400"></div>
        <div className="px-6 sm:px-10 pb-10 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 mb-6 gap-6">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-full p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-primary-100 flex items-center justify-center text-4xl font-bold text-primary-700 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            <div className="text-center sm:text-left flex-grow pb-2">
              <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-slate-600 font-medium">
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{user.rating || '0.0'} ({user.ratingsCount || 0})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-600" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                   {/* In a real app, skills come from user model, here we mock from gigs */}
                   {userGigs.flatMap(g => g.skills).filter((v, i, a) => a.indexOf(v) === i).slice(0,10).map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                   )) || <span className="text-slate-500 text-sm">No skills listed</span>}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Active Gigs</h3>
              {userGigs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userGigs.map(gig => (
                    <a href={`/gigs/${gig._id}`} key={gig._id} className="block group">
                      <div className="border border-slate-100 rounded-2xl p-5 hover:border-primary-200 hover:shadow-md transition-all h-full bg-white">
                        <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md mb-3 inline-block">
                          {gig.category}
                        </span>
                        <h4 className="font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {gig.title}
                        </h4>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
                          <span className="font-bold text-slate-900">${gig.price}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-500">This user has no active gigs.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Briefcase, Zap, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
            >
              Where Student Talent Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-600">Opportunity</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-slate-600 mb-10 leading-relaxed"
            >
              The premium marketplace for students to showcase their skills and clients to find top-tier university talent for their next big project.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/signup" className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 transition-all transform hover:-translate-y-1">
                Join as a Student
              </Link>
              <Link to="/signup" className="bg-white text-slate-800 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                Hire Talent
              </Link>
              <a href="#features" className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all transform hover:-translate-y-1">
                Learn More
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why choose Student Freelance Hub?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              to="/signup"
              icon={<Code className="h-10 w-10 text-primary-500" />}
              title="Build Your Portfolio"
              description="Take on real-world projects, gain experience, and build a stunning portfolio while you study."
            />
            <FeatureCard 
              to="/signup"
              icon={<Briefcase className="h-10 w-10 text-indigo-500" />}
              title="Find Quality Talent"
              description="Access a pool of motivated, skilled students ready to bring fresh perspectives to your business."
            />
            <FeatureCard 
              to="/jobs"
              icon={<Zap className="h-10 w-10 text-amber-500" />}
              title="Secure & Fast"
              description="A streamlined process from posting a job to hiring, with secure communication and tracking."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, to }) => {
  return (
    <Link to={to} className="block h-full">
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full cursor-pointer"
      >
        <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </motion.div>
    </Link>
  );
};

export default Home;

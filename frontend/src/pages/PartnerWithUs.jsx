import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  Users, 
  Globe, 
  Shield, 
  Heart, 
  BarChart, 
  Briefcase, 
  Camera, 
  Handshake, 
  Mail, 
  Phone, 
  ArrowRight,
  CheckCircle2,
  Building2,
  Share2,
  Globe2
} from "lucide-react";
import { motion } from "framer-motion";
import partnerHero from "../assets/partner_hero.png";

const PartnerWithUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    partnershipType: "corporate",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const partnershipTypes = [
    {
      id: "corporate",
      title: "Corporate Partners",
      desc: "Employee wellness programs and facility management solutions for modern workplaces.",
      icon: <Building2 className="text-indigo-600" size={28} />,
      features: ["Bulk Booking Discounts", "Priority Support", "Dedicated Account Manager"]
    },
    {
      id: "influencer",
      title: "Creators & Influencers",
      desc: "Share the love for seamless home services with your audience and earn competitive commissions.",
      icon: <Share2 className="text-purple-600" size={28} />,
      features: ["Custom Promo Codes", "Early Access to Features", "Performance Bonuses"]
    },
    {
      id: "community",
      title: "Community & NGOs",
      desc: "Collaborate on social impact initiatives and provide essential services to those in need.",
      icon: <Heart className="text-rose-600" size={28} />,
      features: ["Subsidized Rates", "Joint Events", "Impact Reporting"]
    }
  ];

  const benefits = [
    {
      title: "Scalable Infrastructure",
      desc: "Leverage our robust platform to provide services at scale across multiple locations.",
      icon: <BarChart size={24} />
    },
    {
      title: "Vetted Professionals",
      desc: "Every provider in our network undergoes rigorous background checks and quality audits.",
      icon: <Shield size={24} />
    },
    {
      title: "Global Reach",
      desc: "Connect with communities and businesses globally through our expanding network.",
      icon: <Globe2 size={24} />
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-medium">Partner With Us</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
                Strategic Alliances
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                Better Together: <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Forge Lasting Partnerships</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-xl">
                Join forces with HomeServiceHub to transform the way home services are delivered. We build meaningful collaborations that drive growth and impact.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#inquiry-form" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2">
                  Start Collaborating <ArrowRight size={20} />
                </a>
                <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all">
                  Our Ecosystem
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-3xl rounded-full"></div>
              <img 
                src={partnerHero} 
                alt="Business Partnership" 
                className="relative rounded-3xl shadow-2xl border-8 border-white w-full h-auto object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block max-w-[240px]">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Handshake className="text-green-600" size={24} />
                  </div>
                  <span className="font-bold text-slate-900">500+ Active Partners</span>
                </div>
                <p className="text-sm text-slate-500">Connecting industries for a seamless service experience.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How Can We Collaborate?</h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Whether you are a global enterprise, a local community leader, or a digital storyteller, we have a place for you in our ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {partnershipTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 border border-slate-100 group-hover:scale-110 transition-transform">
                  {type.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">{type.title}</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">{type.desc}</p>
                <ul className="space-y-4">
                  {type.features.map(feat => (
                    <li key={feat} className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                      <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-indigo-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-800/50 skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight">
                Empowering Your Vision with Our Technology
              </h2>
              <div className="space-y-8">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-700/50 backdrop-blur-sm border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{benefit.title}</h4>
                      <p className="text-indigo-100/70 leading-relaxed font-medium">
                        {benefit.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-2 overflow-hidden shadow-2xl">
                 <div className="bg-slate-950 rounded-2xl p-8 aspect-video flex flex-col items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                    <div className="p-4 bg-white/10 rounded-full mb-6">
                      <Handshake size={64} className="text-indigo-400" />
                    </div>
                    <p className="text-2xl font-bold text-center">Join HubX partner network today</p>
                    <p className="text-indigo-300 mt-2">v4.0.0 Global Ecosystem</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry-form" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">Let's Discuss Opportunities</h2>
              <p className="text-lg text-slate-500 mb-12 leading-relaxed">
                Fill out the form below and our strategic partnership team will reach out within 24-48 business hours. We're excited to hear your ideas!
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <Mail size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Email Us</h5>
                    <p className="text-slate-500">partners@homeservicehub.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <Phone size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Call Us</h5>
                    <p className="text-slate-500">+1 (888) HUB-PARTNER</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100"
            >
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                      placeholder="Acme Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Partnership Type</label>
                    <select 
                      className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-white font-medium text-slate-600"
                      value={formData.partnershipType}
                      onChange={(e) => setFormData({...formData, partnershipType: e.target.value})}
                    >
                      <option value="corporate">Corporate Partnership</option>
                      <option value="influencer">Influencer Collaboration</option>
                      <option value="community">Community / NGO Program</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Collaboration Ideas</label>
                    <textarea 
                      rows={4}
                      className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none"
                      placeholder="Tell us how you'd like to partner..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-lg"
                  >
                    Submit Inquiry
                  </button>
                  <p className="text-xs text-center text-slate-400">
                    By submitting, you agree to our Partnership Terms and Privacy Policy.
                  </p>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Inquiry Received!</h3>
                  <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-sm mx-auto">
                    Thank you for your interest. A member of our Partnership Team will reach out to you shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                  >
                    Send another inquiry
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerWithUs;

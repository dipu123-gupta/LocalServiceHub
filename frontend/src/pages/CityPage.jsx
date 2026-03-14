import React from "react";
import { Link, useParams } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  ChevronRight,
  TrendingUp,
  Award,
  Users
} from "lucide-react";
import { motion } from "framer-motion";

const CityPage = () => {
  const { cityName } = useParams();

  // Format city name for display (capitalize first letter, replace hyphens with spaces)
  const displayCity = cityName
    ? cityName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "City";

  const categories = [
    { name: "Home Cleaning", count: 124, icon: "🧹", color: "bg-blue-50" },
    { name: "Plumbing", count: 85, icon: "🔧", color: "bg-orange-50" },
    { name: "Electrical", count: 62, icon: "⚡", color: "bg-yellow-50" },
    { name: "Handyman", count: 104, icon: "🔨", color: "bg-slate-50" },
    { name: "Painting", count: 43, icon: "🎨", color: "bg-pink-50" },
    { name: "HVAC", count: 38, icon: "❄️", color: "bg-cyan-50" },
  ];

  const cityFaqs = [
    {
      question: `How many professionals are available in ${displayCity}?`,
      answer: `We currently have over 450 vetted professionals operating across all service categories in ${displayCity} and the surrounding metropolitan area.`,
    },
    {
      question: `Do you offer same-day service in ${displayCity}?`,
      answer: `Yes! Depending on the service category and time of booking, we offer same-day and next-day service availability in most parts of ${displayCity}.`,
    },
    {
      question: `Are your professionals licensed to work in ${displayCity}?`,
      answer: `Absolutely. All our professionals are required to maintain active local state and city licenses where applicable for their trade in ${displayCity}.`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Premium Hero Section */}
      <div className="relative bg-slate-900 pt-32 pb-48 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -ml-40 -mb-40" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-2 text-indigo-300 font-bold text-sm mb-12"
          >
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/services" className="hover:text-white transition-colors">Cities</Link>
            <ChevronRight size={14} />
            <span className="text-white">{displayCity}</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-20">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/20 border border-indigo-600/30 text-indigo-300 text-xs font-black uppercase tracking-widest mb-8 shadow-sm"
              >
                <MapPin size={14} /> Now serving {displayCity}
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]"
              >
                Elite Home Services <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">for {displayCity} Residents</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-400 font-semibold mb-12 leading-relaxed max-w-2xl"
              >
                Connect with the most reliable, trusted, and verified professionals. 
                From emergency repairs to luxury lifestyle services, we've got you covered.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-8"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                    <Star size={20} fill="currentColor" />
                  </div>
                  <div>
                    <div className="text-white font-black text-xl leading-none">4.9/5</div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Avg Rating</div>
                  </div>
                </div>
                <div className="w-[1px] h-10 bg-slate-800 hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="text-white font-black text-xl leading-none">100%</div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Vetted Pros</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full lg:max-w-md"
            >
              <div className="bg-white/10 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative group">
                <div className="absolute -top-6 -right-6 bg-indigo-600 text-white font-black px-6 py-2 rounded-2xl text-xs shadow-xl rotate-12 transition-transform group-hover:rotate-0 duration-500 tracking-widest uppercase">
                  Book Now
                </div>
                
                <h3 className="text-2xl font-black text-white mb-8">Quick Professional Finder</h3>
                
                <div className="space-y-6">
                  <div className="relative">
                    <select className="w-full pl-6 pr-12 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold appearance-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer">
                      <option className="bg-slate-900" value="">Select a Category</option>
                      {categories.map((c, i) => (
                        <option className="bg-slate-900 font-bold" key={i} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 rotate-90" size={20} />
                  </div>

                  <button className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-lg hover:bg-slate-900 transition-all shadow-xl shadow-indigo-900/20 active:scale-95 flex items-center justify-center gap-3 group/btn">
                    Browse verified Pros <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Popular Services Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-24 relative z-20">
        <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-12 md:p-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">
                <TrendingUp size={12} /> Neighborhood favorites
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Trending in {displayCity}
              </h2>
            </div>
            <Link to="/categories" className="px-8 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black hover:bg-slate-100 transition-all flex items-center gap-2">
              View All Categories <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col items-center justify-center p-10 bg-slate-50 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all cursor-pointer border border-transparent hover:border-indigo-100"
              >
                <div className={`w-20 h-20 rounded-3xl ${cat.color} flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {cat.icon}
                </div>
                <span className="font-black text-slate-900 text-center text-sm leading-tight group-hover:text-indigo-600">
                  {cat.name}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                  {cat.count} Pros
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1 space-y-12">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
                The Trusted Partner for <span className="text-indigo-600">{displayCity} Homes</span>
              </h2>
              <p className="text-slate-500 font-bold text-lg leading-relaxed">
                We combine modern technology with local expertise to deliver the best home maintenance experience in the city.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {[
                {
                  icon: <Clock size={28} />,
                  title: "60-Min Response",
                  desc: "Emergency services reach your doorstep across all major neighborhoods within the hour."
                },
                {
                  icon: <Award size={28} />,
                  title: "Local Specialists",
                  desc: "Our pros are specific to the unique architecture and local building codes of {displayCity}."
                },
                {
                  icon: <Users size={28} />,
                  title: "Community Driven",
                  desc: "Read trusted reviews from your neighbors and community members."
                },
                {
                  icon: <ShieldCheck size={28} />,
                  title: "Service Guarantee",
                  desc: "Your satisfaction is our absolute priority. Paid only when you're 100% happy."
                }
              ].map((feat, i) => (
                <div key={i} className="group">
                  <div className="w-14 h-14 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{feat.title}</h3>
                  <p className="text-slate-500 font-bold text-sm leading-relaxed">
                    {feat.desc.replace("{displayCity}", displayCity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="aspect-square relative flex items-center justify-center">
              <div className="absolute inset-0 bg-indigo-600/5 rounded-full blur-[100px] animate-pulse" />
              <div className="w-full h-full rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-[12px] border-white ring-1 ring-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1541888082662-7917eaf90f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt={`${displayCity} cityscape`}
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-50 z-20 flex items-center gap-6 max-w-xs group transition-transform hover:-translate-y-2">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg">
                  <Star size={32} fill="currentColor" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900 leading-none">4,500+</div>
                  <div className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-2">Verified Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection
        faqs={cityFaqs}
        title={`Questions about ${displayCity} Services`}
        subtitle="Common questions from local residents."
      />

      <div className="pb-24">
        <CTASection
          title={`Ready to maintain your ${displayCity} home?`}
          description="Book top-rated professionals in just a few clicks. Guaranteed quality every time."
        />
      </div>
    </div>
  );
};

export default CityPage;

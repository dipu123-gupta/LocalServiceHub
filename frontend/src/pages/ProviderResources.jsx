import React from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  BookOpen, 
  Video, 
  Download, 
  Search, 
  Trophy, 
  Shield, 
  TrendingUp, 
  HelpCircle,
  ExternalLink,
  Play,
  FileText,
  Star,
  Clock,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import resourcesHero from "../assets/resources_hero.png";

const ProviderResources = () => {
  const categories = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: "Getting Started",
      count: "12 Guides",
      color: "blue"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      title: "Growth & Marketing",
      count: "8 Guides",
      color: "green"
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: "Safety & Quality",
      count: "15 Guides",
      color: "purple"
    },
    {
      icon: <Star className="w-6 h-6 text-orange-600" />,
      title: "Level Up Program",
      count: "5 Modules",
      color: "orange"
    }
  ];

  const featuredResources = [
    {
      title: "Mastering Customer Reviews",
      desc: "Learn how to turn every job into a 5-star review and build your reputation.",
      type: "Guide",
      duration: "10 min read",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Setting Your Competitive Pricing",
      desc: "Understand market rates and how to price your services for maximum earnings.",
      type: "Video",
      duration: "5 min",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Safe On-site Practices",
      desc: "Essential safety protocols for every home visit to protect you and your clients.",
      type: "Safety",
      duration: "15 min course",
      image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-20">
      {/* Hero Section */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/provider/signup" className="hover:text-indigo-600 transition-colors">Provider</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900 dark:text-white font-medium">Resources</span>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-6"
              >
                Tools to Scale <br />
                <span className="text-indigo-600">Your Business</span>
              </motion.h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl leading-relaxed">
                Unlock your full potential with our library of guides, video training, and expert tips designed specifically for home service professionals.
              </p>
              
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search for guides, videos, or tips..." 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                />
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <img src={resourcesHero} alt="Resources" className="w-full h-auto drop-shadow-2xl" />
                <div className="absolute -bottom-6 -right-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-50 dark:border-slate-700 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-xl">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Pro Badge Earned</p>
                      <p className="text-xs text-slate-500">Complete 5 more guides to level up</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${cat.color}-100 dark:bg-${cat.color}-900/30 flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{cat.title}</h3>
              <p className="text-slate-500 text-sm font-medium">{cat.count}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Featured Training</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl">Curated content to help you improve your service delivery and customer satisfaction.</p>
            </div>
            <Link to="#" className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
              View All Resources <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredResources.map((res, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] mb-6">
                  <img src={res.image} alt={res.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {res.type === "Video" && (
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 scale-90 group-hover:scale-100 transition-transform">
                          <Play fill="currentColor" size={32} />
                        </div>
                     </div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-lg text-xs font-bold text-slate-900 dark:text-white">
                    {res.type}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
                   <Clock size={14} /> {res.duration}
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors leading-snug">{res.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{res.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 dark:bg-indigo-900/20 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-500/10 blur-[120px] rounded-full" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Provider Success Kit</h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                Download templates, brand assets, and checklists to keep your business organized and professional at every job site.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Service Checklist", ext: ".PDF (2.4MB)" },
                  { title: "Invoice Template", ext: ".XLSX (1.1MB)" },
                  { title: "Safety Guidelines", ext: ".PDF (3.8MB)" },
                  { title: "Brand Assets", ext: ".ZIP (12MB)" }
                ].map((item, i) => (
                  <button key={i} className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between group transition-all text-left">
                    <div>
                      <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                      <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{item.ext}</p>
                    </div>
                    <Download className="text-slate-500 group-hover:text-white transition-colors" size={20} />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 grid grid-cols-2 gap-6 w-full">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 font-bold text-2xl tracking-tighter italic">
                   B!
                </div>
                <h5 className="text-white font-bold mb-2">Brand Identity</h5>
                <p className="text-slate-500 text-xs">Logo & Color guides</p>
              </div>
              <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6 font-bold text-2xl">
                   <FileText size={32} />
                </div>
                <h5 className="text-white font-bold mb-2">Legal Manual</h5>
                <p className="text-slate-500 text-xs">Contracts & Terms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community / Support */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Still Need Help?</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Our support team and pro community are here for you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-10 bg-indigo-50 dark:bg-slate-900 rounded-[2.5rem] border border-indigo-100 dark:border-slate-800 flex flex-col items-center text-center group transition-all hover:bg-indigo-100 dark:hover:bg-slate-800">
             <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 shadow-sm mb-6">
               <HelpCircle size={32} />
             </div>
             <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Help Center</h4>
             <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xs">Detailed articles and instant answers to common platform questions.</p>
             <Link to="/help" className="px-8 py-3 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white hover:bg-brand-50 transition-all flex items-center gap-2">
               Open Help Center <ExternalLink size={18} />
             </Link>
          </div>
          
          <div className="p-10 bg-purple-50 dark:bg-slate-900 rounded-[2.5rem] border border-purple-100 dark:border-slate-800 flex flex-col items-center text-center group transition-all hover:bg-purple-100 dark:hover:bg-slate-800">
             <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-purple-600 shadow-sm mb-6">
               <MessageSquare size={32} />
             </div>
             <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Pro Community</h4>
             <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xs">Connect with other professionals, share tips, and grow together.</p>
             <a href="#" className="px-8 py-3 bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white hover:bg-brand-50 transition-all flex items-center gap-2">
               Join Community <ExternalLink size={18} />
             </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProviderResources;

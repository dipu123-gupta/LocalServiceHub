import React from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Users,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import providerHero from "../assets/provider_hero.png";

const BecomeProvider = () => {
  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6 text-indigo-600" />,
      title: "Earn More",
      description: "Join thousands of professionals earning 3x more than traditional service models. Keep what you earn with transparent commissions."
    },
    {
      icon: <Clock className="w-6 h-6 text-indigo-600" />,
      title: "Flexible Hours",
      description: "You are your own boss. Work when you want, where you want. Set your own availability and manage your schedule easily."
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      title: "High Demand",
      description: "Access a steady stream of customers in your area. We handle the marketing so you can focus on what you do best."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      title: "Secure Payments",
      description: "Get paid on time, every time. Our secure payment system ensures your earnings are deposited directly to your bank account."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Register Your Profile",
      description: "Create an account, tell us about your services, and upload your documents for verification."
    },
    {
      number: "02",
      title: "Get Verified",
      description: "Our team will review your application and background check to ensure quality standards."
    },
    {
      number: "03",
      title: "Start Working",
      description: "Receive job requests, complete tasks, and start earning money right away."
    }
  ];

  const faqs = [
    {
      question: "How do I get paid?",
      answer: "Payments are processed securely through our platform. Once a job is marked as complete, the funds are transferred to your wallet, which you can withdraw at any time."
    },
    {
      question: "Is there a registration fee?",
      answer: "Joining LocalServiceHub is free! We only take a small commission on successful bookings to help run the platform and bring you more customers."
    },
    {
    question: "What items do I need to register?",
    answer: "You'll need a valid ID, proof of address, and any relevant certifications or licenses for the services you provide."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-6">
              <Zap size={14} className="fill-current" />
              <span>Join the Future of Home Services</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6">
              Be Your Own Boss, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 italic">Start Earning Today</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
              Transform your skills into a thriving business. Join 5,000+ professionals providing top-tier service on LocalServiceHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register?role=provider" 
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Apply Now <ArrowRight size={20} />
              </Link>
              <Link 
                to="/how-it-works" 
                className="px-8 py-4 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-lg transition-all flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-4 py-4 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 max-w-fit">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="Provider" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Rated 4.9/5 stars</p>
                <p className="text-xs text-slate-500">by 5,000+ service providers</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="hidden md:block relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative z-20 rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-200/50 dark:shadow-none border-8 border-white dark:border-slate-800">
              <img 
                src={providerHero} 
                alt="Professional Provider" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl -z-10" />
            
            <motion.div 
              className="absolute -right-6 top-1/4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-30"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                  <DollarSign size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Earnings Today</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">$342.00</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-indigo-600 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Active Jobs", val: "12K+" },
            { label: "Countries", val: "15+" },
            { label: "Reliable Providers", val: "5,000+" },
            { label: "Client Satisfaction", val: "99%" }
          ].map((stat, i) => (
            <div key={i} className="text-center text-white">
              <p className="text-3xl md:text-4xl font-black mb-1">{stat.val}</p>
              <p className="text-indigo-100 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Why Professionals Choose Us</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              We provide the tools and platform you need to grow your service business without the hassle of traditional marketing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{benefit.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Simple Steps to Success</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-12 leading-relaxed">
                Joining our platform is quick and easy. Follow these simple steps to start receiving jobs and earning money.
              </p>
              
              <div className="space-y-8">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <span className="text-4xl font-black text-indigo-100 dark:text-indigo-900/30 leading-none">{step.number}</span>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-slate-800">
                  <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=800" alt="Workflow" className="w-full h-full object-cover" />
               </div>
               {/* Overlay Card */}
               <div className="absolute -bottom-8 -left-8 p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 max-w-xs animate-bounce-slow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                      <CheckCircle2 size={24} />
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white">Profile Verified</p>
                  </div>
                  <p className="text-xs text-slate-500 italic">"Welcome to the platform! You're ready to take on your first client."</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Common Questions</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Everything you need to know about becoming a service provider.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all shadow-sm">
                <summary className="p-6 flex items-center justify-between cursor-pointer list-none">
                  <span className="text-lg font-bold text-slate-900 dark:text-white group-open:text-indigo-600 transition-colors">{faq.question}</span>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 transition-transform group-open:rotate-180">
                    <ChevronRight size={18} className="text-slate-400 group-open:text-indigo-600 rotate-90" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[3rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-12 md:p-24 overflow-hidden text-center text-white overflow-hidden shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-6xl font-black mb-8">Ready to grow your <br /> service business?</h2>
              <p className="text-indigo-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto opacity-90 leading-relaxed font-medium">
                Don't wait any longer. Join 5,000+ happy service providers and take your business to the next level today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/register?role=provider" 
                  className="px-12 py-5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-2xl font-black text-xl shadow-2xl shadow-indigo-900/40 transition-all hover:scale-105"
                >
                  Join Now — It's Free
                </Link>
                <Link 
                  to="/contact" 
                  className="px-12 py-5 border-2 border-white/20 hover:border-white/50 text-white rounded-2xl font-black text-xl transition-all"
                >
                  Contact Support
                </Link>
              </div>
              <p className="mt-10 text-indigo-200/60 text-sm font-medium">No hidden fees. No credit card required to sign up.</p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default BecomeProvider;

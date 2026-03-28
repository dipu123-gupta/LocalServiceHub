import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import SectionTitle from "../components/SectionTitle";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";
import {
  Search,
  Book,
  MessageCircle,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbs = [{ label: "Help Center" }];

  const categories = [
    {
      icon: Book,
      title: "Getting Started",
      description:
        "Everything you need to know about creating an account and booking your first service.",
      articleCount: 15,
    },
    {
      icon: MessageCircle,
      title: "Account & Profile",
      description:
        "Manage your personal details, payment methods, and notification preferences.",
      articleCount: 12,
    },
    {
      icon: FileText,
      title: "Payments & Billing",
      description:
        "Learn about our pricing, invoicing, accepted payment methods, and refund policies.",
      articleCount: 24,
    },
  ];

  const popularFaqs = [
    {
      question: "How do I cancel or reschedule a booking?",
      answer:
        "You can easily cancel or reschedule from your user dashboard under the 'Bookings' section. Cancellations made 24 hours prior to the appointment are fully refunded.",
    },
    {
      question: "Are prices negotiable?",
      answer:
        "No, all service prices are standardized and non-negotiable to ensure fair compensation for our professionals and transparent pricing for our customers.",
    },
    {
      question: "What happens if a professional arrives late?",
      answer:
        "While we strive for punctuality, unforeseen circumstances can happen. Professionals will notify you via the app if they are running behind schedule. If they are excessively late without notice, please contact support.",
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Implementation for search functionality would go here
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white pb-32 pt-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-indigo-500 opacity-10 rounded-full blur-2xl"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex justify-center items-center gap-2 text-sm text-indigo-200 mb-6 font-bold uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">Help Center</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            How can we help you?
          </h1>
          <p className="text-xl text-indigo-100 mb-10 font-medium">
            Search our knowledge base or browse categories below.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={24}
              />
              <input
                type="text"
                placeholder="Search for articles, guides, or questions..."
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-lg shadow-2xl dark:shadow-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-indigo-500 transition-colors active:scale-95"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-20 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-gray-100 dark:border-slate-800 shadow-xl dark:shadow-none hover:shadow-2xl dark:hover:bg-slate-800/80 hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8 transition-colors">
                <category.icon size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
                {category.title}
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-8 min-h-[48px] font-medium leading-relaxed transition-colors">
                {category.description}
              </p>
              <Link
                to="#"
                className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-[10px] hover:text-indigo-700 transition-colors group"
              >
                Browse {category.articleCount} articles
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <FAQSection
        faqs={popularFaqs}
        title="Popular Questions"
        subtitle="Quick answers to the most commonly asked questions."
      />

      <CTASection
        title="Still need help?"
        description="Our support team is available around the clock to assist you with any issues."
        primaryButtonText="Contact Support"
        primaryButtonLink="/contact"
        withBackground={true}
      />
    </div>
  );
};
// Add missing import
import { ChevronRight } from "lucide-react";
export default HelpCenter;

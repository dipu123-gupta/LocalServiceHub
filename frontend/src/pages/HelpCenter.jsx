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
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white pb-32 pt-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-indigo-500 opacity-10 rounded-full blur-2xl"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex justify-center items-center gap-2 text-sm text-indigo-200 mb-6">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Help Center</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            How can we help you?
          </h1>
          <p className="text-xl text-indigo-100 mb-10">
            Search our knowledge base or browse categories below.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={24}
              />
              <input
                type="text"
                placeholder="Search for articles, guides, or questions..."
                className="w-full pl-14 pr-6 py-4 rounded-2xl text-gray-900 text-lg shadow-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
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
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <category.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {category.title}
              </h3>
              <p className="text-gray-600 mb-6 min-h-[48px]">
                {category.description}
              </p>
              <Link
                to="#"
                className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors group"
              >
                Browse {category.articleCount} articles
                <ArrowRight
                  size={16}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
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

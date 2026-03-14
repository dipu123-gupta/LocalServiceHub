import React from "react";
import PageHeader from "../components/PageHeader";
import SectionTitle from "../components/SectionTitle";
import CTASection from "../components/CTASection";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Blog = () => {
  const breadcrumbs = [{ label: "Blog" }];

  const categories = [
    "All",
    "Home Improvement",
    "Cleaning",
    "Repairs",
    "Company News",
  ];

  const posts = [
    {
      id: 1,
      title: "10 Essential Home Maintenance Tasks for Spring",
      excerpt:
        "Get your home ready for the warmer months with this comprehensive checklist of essential spring maintenance tasks.",
      category: "Home Improvement",
      date: "Mar 15, 2026",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "How to Choose the Right Plumber for Emergency Repairs",
      excerpt:
        "Don't wait until disaster strikes. Learn how to identify and hire a reliable plumber before you actually need one.",
      category: "Repairs",
      date: "Mar 10, 2026",
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1581560242270-4d4de451ef27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "The Ultimate Guide to Deep Cleaning Your Kitchen",
      excerpt:
        "Transform your kitchen from messy to pristine with our step-by-step deep cleaning guide and professional tips.",
      category: "Cleaning",
      date: "Mar 05, 2026",
      readTime: "7 min read",
      image:
        "https://images.unsplash.com/photo-1556910103-1c02745a872f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "HomeServiceHub Expands to 5 New Cities",
      excerpt:
        "We are thrilled to announce that our top-rated home services are now available in Miami, Austin, Denver, Seattle, and Boston.",
      category: "Company News",
      date: "Feb 28, 2026",
      readTime: "3 min read",
      image:
        "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      title: "Eco-Friendly Cleaning Products: What Really Works",
      excerpt:
        "A comprehensive review of the best green cleaning solutions that are tough on dirt but gentle on the environment.",
      category: "Cleaning",
      date: "Feb 20, 2026",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1584820927498-cafe2c07a769?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      title: "DIY vs Professional: When to Hire an Electrician",
      excerpt:
        "Understanding which electrical projects you can tackle yourself and when it's absolutely necessary to call a pro.",
      category: "Repairs",
      date: "Feb 15, 2026",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Our Blog"
        breadcrumbs={breadcrumbs}
        description="Tips, tricks, and insights on home improvement, cleaning, and professional services."
      />

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-gray-200">
        <div className="flex flex-wrap gap-3">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                index === 0
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors mt-auto"
                >
                  Read full article{" "}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm">
            Load More Articles
          </button>
        </div>
      </section>

      <CTASection
        title="Subscribe to our newsletter"
        description="Get the latest home care tips and exclusive offers delivered straight to your inbox."
        primaryButtonText="Subscribe Now"
        primaryButtonLink="/register"
        secondaryButtonText={null}
      />
    </div>
  );
};

export default Blog;

import React from "react";
import PageHeader from "../components/PageHeader";
import SectionTitle from "../components/SectionTitle";
import FAQSection from "../components/FAQSection";
import { LifeBuoy, Clock, Zap, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Support = () => {
  const breadcrumbs = [{ label: "Support" }];

  const supportOptions = [
    {
      icon: Zap,
      title: "Live Chat",
      description: "Immediate assistance from our team.",
      linkText: "Start Chat",
      link: "#",
    },
    {
      icon: LifeBuoy,
      title: "Email Support",
      description: "Get detailed help within 2 hours.",
      linkText: "Email Us",
      link: "/contact",
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Self-serve articles and guides.",
      linkText: "Browse Guides",
      link: "/help",
    },
    {
      icon: Clock,
      title: "24/7 Phone Line",
      description: "For urgent matters and emergencies.",
      linkText: "Call Now",
      link: "tel:+18001234567",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Customer Support"
        breadcrumbs={breadcrumbs}
        description="We're here to help you get the most out of HomeServiceHub."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          title="How would you like to get help?"
          subtitle="Choose the most convenient way to reach our dedicated support specialists."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {supportOptions.map((option, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 mx-auto shadow-sm mb-4">
                <option.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {option.title}
              </h3>
              <p className="text-sm text-gray-600 mb-6">{option.description}</p>
              <Link
                to={option.link}
                className="inline-block w-full py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
              >
                {option.linkText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-indigo-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Need to report a serious issue?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our Trust & Safety team handles escalations, property damage claims,
            and behavioral reports with the utmost priority.
          </p>
          <Link
            to="/contact"
            className="inline-flex justify-center items-center px-8 py-4 rounded-xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-all shadow-lg"
          >
            Report an Incident
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Support;

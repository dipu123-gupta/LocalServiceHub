import React from "react";
import PageHeader from "../components/PageHeader";
import SectionTitle from "../components/SectionTitle";
import CTASection from "../components/CTASection";
import { Briefcase, Heart, Coffee, Laptop } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Careers = () => {
  const breadcrumbs = [{ label: "Careers" }];

  const perks = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description:
        "Comprehensive health, dental, and vision insurance for you and your dependents.",
    },
    {
      icon: Laptop,
      title: "Remote First",
      description:
        "Work from anywhere with a flexible schedule and a generous home office stipend.",
    },
    {
      icon: Briefcase,
      title: "Career Growth",
      description:
        "Annual learning budget, mentorship programs, and clear paths for advancement.",
    },
    {
      icon: Coffee,
      title: "Unlimited PTO",
      description:
        "Take the time you need to recharge. We encourage a healthy work-life balance.",
    },
  ];

  const openRoles = [
    {
      department: "Engineering",
      title: "Senior Frontend Engineer",
      location: "Remote",
      type: "Full-time",
    },
    {
      department: "Engineering",
      title: "Backend Developer (Node.js)",
      location: "San Francisco, CA",
      type: "Full-time",
    },
    {
      department: "Design",
      title: "UX/UI Designer",
      location: "Remote",
      type: "Contract",
    },
    {
      department: "Operations",
      title: "City Manager",
      location: "New York, NY",
      type: "Full-time",
    },
    {
      department: "Customer Success",
      title: "Support Specialist",
      location: "Remote",
      type: "Full-time",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Join Our Team"
        breadcrumbs={breadcrumbs}
        description="Help us build the absolute best home service experience. We're looking for passionate people to join our mission."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          title="Why Work With Us?"
          subtitle="We believe in creating a supportive, inclusive, and challenging environment where you can do the best work of your career."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {perks.map((perk, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 text-center hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-100"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6">
                <perk.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {perk.title}
              </h3>
              <p className="text-gray-600">{perk.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <SectionTitle
            title="Open Positions"
            subtitle="Find your perfect role and help us shape the future of local services."
          />

          <div className="mt-12 space-y-4">
            {openRoles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div>
                  <div className="text-sm font-medium text-indigo-600 mb-1">
                    {role.department}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {role.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {role.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} /> {role.type}
                    </span>
                  </div>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex justify-center items-center px-6 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-600 hover:text-white transition-colors shrink-0"
                >
                  Apply Now
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Don't see a role that fits?</p>
            <Link
              to="/contact"
              className="text-indigo-600 font-medium hover:underline inline-flex items-center gap-2"
            >
              Send us your resume anyway <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to become a service provider instead?"
        description="Join our network of professionals and start growing your business today."
        primaryButtonText="Join as a Pro"
        primaryButtonLink="/provider/signup"
        withBackground={true}
      />
    </div>
  );
};
// Add import that was missing
import { ArrowRight, MapPin } from "lucide-react";
export default Careers;

import React from "react";
import PageHeader from "../components/PageHeader";
import SectionTitle from "../components/SectionTitle";
import InfoCard from "../components/InfoCard";
import CTASection from "../components/CTASection";
import { Target, Users, Shield, Award } from "lucide-react";

const About = () => {
  const breadcrumbs = [{ label: "About Us" }];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To empower local professionals and provide users with reliable, top-quality home services at their fingertips.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "We believe in building a strong community where trust and mutual respect drive every interaction on our platform.",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "Every professional is thoroughly vetted, and every service is backed by our comprehensive satisfaction guarantee.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We constantly strive for excellence, ensuring that every service delivered meets our high standards of quality.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <PageHeader
        title="About HomeServiceHub"
        breadcrumbs={breadcrumbs}
        description="We are revolutionizing the way you experience home services by connecting you with top-rated local professionals."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">Our Story</h2>
            <p className="text-lg text-gray-600 dark:text-slate-400 mb-4 leading-relaxed transition-colors">
              Founded with the vision to simplify home maintenance,
              HomeServiceHub began as a small initiative to bridge the gap
              between skilled local professionals and homeowners in need of
              reliable services.
            </p>
            <p className="text-lg text-gray-600 dark:text-slate-400 mb-4 leading-relaxed transition-colors">
              Over the years, we've grown into a comprehensive marketplace,
              meticulously vetting each service provider to ensure our users
              receive nothing but the best. From humble beginnings to a trusted
              platform, our journey has been fueled by a commitment to quality
              and customer satisfaction.
            </p>
            <p className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed transition-colors">
              Today, we are proud to handle thousands of service requests daily,
              continually innovating to make the process as seamless and
              transparent as possible.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl overflow-hidden shadow-xl transition-colors">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Our team working"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-800 hidden sm:block transition-all">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-1 transition-colors">
                10k+
              </div>
              <div className="text-gray-600 dark:text-slate-400 font-medium transition-colors">
                Services Delivered
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-slate-900/50 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Our Core Values"
            subtitle="The principles that guide everything we do and how we operate as a company."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <InfoCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to experience the difference?"
        description="Join our growing community and book your first service today."
        primaryButtonText="Book a Service"
      />
    </div>
  );
};

export default About;

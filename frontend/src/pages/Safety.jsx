import React from "react";
import PageHeader from "../components/PageHeader";
import SectionTitle from "../components/SectionTitle";
import InfoCard from "../components/InfoCard";
import CTASection from "../components/CTASection";
import { Shield, Lock, CheckCircle, AlertTriangle } from "lucide-react";

const Safety = () => {
  const breadcrumbs = [{ label: "Trust & Safety" }];

  const safetyPillars = [
    {
      icon: CheckCircle,
      title: "Stringent Background Checks",
      description:
        "Every single service professional undergoes a comprehensive, multi-step background check before they are allowed on our platform. This includes national footprint checks, criminal records, and identity verification.",
    },
    {
      icon: Shield,
      title: "Our Protection Guarantee",
      description:
        "We back every booking with our HomeProtection Guarantee. If property damage or injury occurs directly due to a completed service (up to $1,000,000), we are here to support you in making it right.",
    },
    {
      icon: Lock,
      title: "Secure Payment Processing",
      description:
        "Your financial data is never shared with professionals. All transactions are securely processed through our encrypted, PCI-compliant payment gateways, providing full consumer protection.",
    },
    {
      icon: AlertTriangle,
      title: "24/7 Incident Response",
      description:
        "In the rare event that an issue arises during a service appointment, our specialized Trust & Safety team is available 24/7 to intervene, assist, and mediate a swift resolution.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Trust & Safety"
        breadcrumbs={breadcrumbs}
        description="Your safety and peace of mind are our absolute top priorities. Discover the extensive measures we take to protect our community."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          title="The HomeServiceHub Standard"
          subtitle="We maintain the highest safety standards in the industry so you can book with complete confidence."
        />

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {safetyPillars.map((pillar, index) => (
            <InfoCard
              key={index}
              icon={pillar.icon}
              title={pillar.title}
              description={pillar.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>

      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <SectionTitle
            title="Covid-19 & Health Protocols"
            subtitle="Keeping both customers and professionals safe during home visits."
          />
          <div className="mt-8 prose prose-lg prose-indigo mx-auto text-gray-600">
            <p>
              We continue to monitor guidelines from major health organizations
              to ensure our service procedures are safe. Professionals are
              required to adhere to health best practices, including regular
              sanitization of their tools and equipment.
            </p>
            <p className="mt-4">
              If either you or the service professional feels unwell prior to an
              appointment, we encourage immediate rescheduling without penalty.
            </p>
          </div>
        </div>
      </section>

      <CTASection
        title="Experience safe, reliable services"
        description="Join thousands of happy customers who trust HomeServiceHub with their homes."
        primaryButtonText="Find a Professional"
      />
    </div>
  );
};

export default Safety;

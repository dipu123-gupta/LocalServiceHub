import React from "react";
import PageHeader from "../components/PageHeader";
import SectionTitle from "../components/SectionTitle";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";
import { Search, CalendarCheck, CreditCard, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const breadcrumbs = [{ label: "How It Works" }];

  const steps = [
    {
      icon: Search,
      title: "Find Your Service",
      description:
        "Browse through our extensive list of home services. Select what you need, from cleaning and plumbing to electrical and handymen.",
    },
    {
      icon: CalendarCheck,
      title: "Schedule a Time",
      description:
        "Choose a date and time that works best for your schedule. We offer flexible booking options, including same-day service in many areas.",
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description:
        "Review the upfront pricing and securely pay through our platform. No hidden fees or surprise charges.",
    },
    {
      icon: ShieldCheck,
      title: "Job Well Done",
      description:
        "A verified professional arrives to get the job done. Every booking is backed by our full satisfaction guarantee.",
    },
  ];

  const faqs = [
    {
      question: "Are the professionals thoroughly vetted?",
      answer:
        "Yes, every service provider undergoes a rigorous background check, skill assessment, and ongoing performance reviews to ensure safety and quality.",
    },
    {
      question: "What happens if I'm not satisfied with the service?",
      answer:
        "We offer a 100% satisfaction guarantee. If you're not happy with the work, contact our support team within 24 hours, and we'll make it right.",
    },
    {
      question: "How is pricing determined?",
      answer:
        "Pricing is transparent and standardized based on the type of service, local market rates, and the required materials. You will always see the full price before booking.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="How It Works"
        breadcrumbs={breadcrumbs}
        description="Getting your home maintenance tasks done has never been easier. Follow these simple steps."
      />

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          title="Four Simple Steps"
          subtitle="From booking to completion, we've designed our process to be as seamless and transparent as possible."
        />

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-indigo-100 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center shadow-xl mb-6 text-indigo-600 relative">
                <step.icon size={36} />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <FAQSection
        faqs={faqs}
        title="Common Questions"
        subtitle="Learn more about how our platform operates."
      />

      <CTASection
        title="Ready to get started?"
        description="Browse our services and book your first professional today."
      />
    </div>
  );
};

export default HowItWorks;

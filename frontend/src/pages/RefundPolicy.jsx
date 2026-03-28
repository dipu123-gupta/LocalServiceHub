import React from "react";
import PageHeader from "../components/PageHeader";
import { motion } from "framer-motion";

const ContentSection = ({ title, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mb-12"
  >
    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight transition-colors">{title}</h2>
    <div className="prose prose-indigo max-w-none text-slate-600 dark:text-slate-400 font-medium leading-relaxed transition-colors">
      {children}
    </div>
  </motion.section>
);

const RefundPolicy = () => {
  const breadcrumbs = [{ label: "Refund Policy" }];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <PageHeader
        title="Refund Policy"
        breadcrumbs={breadcrumbs}
        description="Understanding our HomeProtection Guarantee and refund procedures."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 p-8 md:p-14 transition-colors">
          <ContentSection title="Satisfaction Guarantee">
            <p>
              At HomeServiceHub, we stand behind the quality of the services
              provided through our platform. If you are not completely satisfied
              with a completed service, we are committed to making it right.
            </p>
          </ContentSection>

          <ContentSection title="Eligibility for Refunds">
            <p className="mb-6">You may be eligible for a full or partial refund if:</p>
            <ul className="space-y-4">
              <li>
                The service professional failed to show up for the confirmed
                booking.
              </li>
              <li>
                The completed work fundamentally differed from the agreed-upon
                scope.
              </li>
              <li>
                The work resulted in direct damage to your property (covered
                under the separate HomeProtection plan).
              </li>
              <li>
                You canceled the service following our Cancellation Policy
                guidelines.
              </li>
            </ul>
          </ContentSection>

          <ContentSection title="How to Request a Refund">
            <p className="mb-6">To initiate a refund request, you must:</p>
            <ol className="space-y-4">
              <li>
                Contact our support team within <strong>48 hours</strong> of the
                service completion time.
              </li>
              <li>
                Provide photographic evidence of incomplete or unsatisfactory
                work, if applicable.
              </li>
              <li>Provide a detailed description of the issue.</li>
            </ol>
            <p className="mt-8">
              Our Trust & Safety team will review the claim, speak with the
              service provider, and issue a resolution within 3-5 business days.
            </p>
          </ContentSection>

          <ContentSection title="Non-Refundable Circumstances">
            <p className="mb-6">Refunds will not be issued if:</p>
            <ul className="space-y-4">
              <li>
                The service issue was reported more than 48 hours after
                completion.
              </li>
              <li>
                You paid the provider directly in cash, bypassing our platform's
                payment system.
              </li>
              <li>
                The issue arose due to pre-existing conditions that the provider
                explicitly warned you about prior to starting work.
              </li>
            </ul>
          </ContentSection>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;

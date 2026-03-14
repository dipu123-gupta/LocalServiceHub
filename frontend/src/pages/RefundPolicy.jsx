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
    <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
    <div className="prose prose-indigo max-w-none text-gray-600">
      {children}
    </div>
  </motion.section>
);

const RefundPolicy = () => {
  const breadcrumbs = [{ label: "Refund Policy" }];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Refund Policy"
        breadcrumbs={breadcrumbs}
        description="Understanding our HomeProtection Guarantee and refund procedures."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <ContentSection title="Satisfaction Guarantee">
            <p>
              At HomeServiceHub, we stand behind the quality of the services
              provided through our platform. If you are not completely satisfied
              with a completed service, we are committed to making it right.
            </p>
          </ContentSection>

          <ContentSection title="Eligibility for Refunds">
            <p>You may be eligible for a full or partial refund if:</p>
            <ul>
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
            <p>To initiate a refund request, you must:</p>
            <ol>
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
            <p>
              Our Trust & Safety team will review the claim, speak with the
              service provider, and issue a resolution within 3-5 business days.
            </p>
          </ContentSection>

          <ContentSection title="Non-Refundable Circumstances">
            <p>Refunds will not be issued if:</p>
            <ul>
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

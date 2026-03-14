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

const TermsOfService = () => {
  const breadcrumbs = [{ label: "Terms of Service" }];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Terms of Service"
        breadcrumbs={breadcrumbs}
        description="Please read these terms carefully before using our platform."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <ContentSection title="1. Agreement to Terms">
            <p>
              By accessing or using HomeServiceHub, you agree to be bound by
              these Terms of Service and all applicable laws and regulations. If
              you do not agree with any of these terms, you are prohibited from
              using or accessing this site.
            </p>
          </ContentSection>

          <ContentSection title="2. Platform Functionality">
            <p>
              HomeServiceHub operates as a marketplace connecting individuals
              seeking home services ("Users") with independent professionals
              providing those services ("Providers"). We do not directly provide
              the home services, nor do we employ the Providers.
            </p>
            <ul>
              <li>
                We perform background checks on Providers but cannot guarantee
                their actions.
              </li>
              <li>
                Users are responsible for verifying the scope of work with the
                Provider before service begins.
              </li>
              <li>
                Payments must be processed through the platform to be eligible
                for our HomeProtection Guarantee.
              </li>
            </ul>
          </ContentSection>

          <ContentSection title="3. User Accounts">
            <p>
              When you create an account with us, you must provide accurate,
              complete, and current information. Failure to do so constitutes a
              breach of the Terms, which may result in immediate termination of
              your account.
            </p>
            <p>
              You are responsible for safeguarding the password and for all
              activities or actions under your password.
            </p>
          </ContentSection>

          <ContentSection title="4. Prohibited Uses">
            <p>You may not use the platform to:</p>
            <ul>
              <li>Violate any applicable laws or regulations.</li>
              <li>Harass, abuse, or harm another person.</li>
              <li>
                Bypass the platform's payment system to pay Providers directly
                in cash.
              </li>
              <li>Attempt to gain unauthorized access to our systems.</li>
            </ul>
          </ContentSection>

          <ContentSection title="5. Termination">
            <p>
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms.
            </p>
          </ContentSection>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

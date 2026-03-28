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

const PrivacyPolicy = () => {
  const breadcrumbs = [{ label: "Privacy Policy" }];

  const lastUpdated = "March 10, 2026";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <PageHeader
        title="Privacy Policy"
        breadcrumbs={breadcrumbs}
        description={`Last updated: ${lastUpdated}`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 p-8 md:p-14 transition-colors">
          <ContentSection title="1. Introduction">
            <p>
              Welcome to HomeServiceHub. We respect your privacy and are
              committed to protecting your personal data. This privacy policy
              will inform you about how we look after your personal data when
              you visit our website or use our application.
            </p>
          </ContentSection>

          <ContentSection title="2. The Data We Collect">
            <p className="mb-6">
              We may collect, use, store and transfer different kinds of
              personal data about you which we have grouped together as follows:
            </p>
            <ul className="space-y-4">
              <li>
                <strong className="text-slate-900 dark:text-white">Identity Data:</strong> includes first name, last name,
                username or similar identifier.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Contact Data:</strong> includes billing address, service
                address, email address and telephone numbers.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Financial Data:</strong> includes payment card details
                (processed securely by our third-party payment providers; we do
                not store full card numbers).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Transaction Data:</strong> includes details about
                payments to and from you and other details of services you have
                purchased from us.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Technical Data:</strong> includes internet protocol (IP)
                address, your login data, browser type and version.
              </li>
            </ul>
          </ContentSection>

          <ContentSection title="3. How We Use Your Data">
            <p className="mb-6">
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>
            <ul className="space-y-4">
              <li>
                Where we need to perform the contract we are about to enter into
                or have entered into with you (e.g., fulfilling a service
                booking).
              </li>
              <li>
                Where it is necessary for our legitimate interests (or those of
                a third party) and your interests and fundamental rights do not
                override those interests.
              </li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </ContentSection>

          <ContentSection title="4. Data Security">
            <p>
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used, or accessed in
              an unauthorized way, altered, or disclosed. In addition, we limit
              access to your personal data to those employees, agents,
              contractors, and other third parties who have a business need to
              know.
            </p>
          </ContentSection>

          <ContentSection title="5. Your Legal Rights">
            <p className="mb-6">
              Under certain circumstances, you have rights under data protection
              laws in relation to your personal data, including the right to:
            </p>
            <ul className="space-y-4">
              <li>Request access to your personal data.</li>
              <li>Request correction of your personal data.</li>
              <li>Request erasure of your personal data.</li>
              <li>Object to processing of your personal data.</li>
            </ul>
          </ContentSection>

          <div className="mt-14 pt-10 border-t border-slate-100 dark:border-slate-800 transition-colors">
            <p className="text-slate-500 dark:text-slate-500 text-sm font-medium">
              If you have any questions about this privacy policy or our privacy
              practices, please contact us at{" "}
              <a
                href="mailto:privacy@homeservicehub.com"
                className="text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
              >
                privacy@homeservicehub.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

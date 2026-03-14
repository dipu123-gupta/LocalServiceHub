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

const CancellationPolicy = () => {
  const breadcrumbs = [{ label: "Cancellation Policy" }];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Cancellation & Rescheduling Policy"
        breadcrumbs={breadcrumbs}
        description="Understanding how to modify your appointments and potential fees."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <ContentSection title="Standard Cancellation Guidelines">
            <p>
              We understand that schedules change. To respect the time of our
              service professionals, we ask that you adhere to the following
              cancellation windows:
            </p>
            <ul>
              <li>
                <strong>More than 24 Hours Notice:</strong> You may cancel or
                reschedule any booking without penalty up to 24 hours before the
                scheduled service time. A full refund will be issued if payment
                was processed.
              </li>
              <li>
                <strong>Between 2 & 24 Hours Notice:</strong> Cancellations made
                within this window are subject to a late cancellation fee equal
                to 20% of the quoted service price to compensate the
                professional for their blocked schedule.
              </li>
              <li>
                <strong>Less Than 2 Hours Notice & No Shows:</strong>{" "}
                Cancellations made under 2 hours or failure to provide access to
                the property (No Show) will result in a fee equal to 50% of the
                quoted service price.
              </li>
            </ul>
          </ContentSection>

          <ContentSection title="How to Cancel or Reschedule">
            <p>
              Cancellations and rescheduling must be performed exclusively
              through the HomeServiceHub platform to be recognized:
            </p>
            <ol>
              <li>Log into your account.</li>
              <li>Navigate to the "My Bookings" section on your Dashboard.</li>
              <li>Select the specific booking you wish to modify.</li>
              <li>
                Click "Cancel Booking" or "Reschedule" and follow the prompts.
              </li>
            </ol>
            <p>
              Direct communication with the service professional regarding a
              cancellation does not officially cancel the booking in our system.
            </p>
          </ContentSection>

          <ContentSection title="Exceptions & Emergencies">
            <p>
              In cases of genuine emergencies (e.g., severe illness, accidents,
              or extreme weather conditions), we may waive the cancellation fee
              on a case-by-case basis. Please contact support immediately if you
              face an emergency situation preventing you from keeping your
              appointment.
            </p>
          </ContentSection>

          <ContentSection title="Professional Cancellations">
            <p>If a service professional cancels a confirmed booking:</p>
            <ul>
              <li>You will be notified immediately.</li>
              <li>You will receive an automatic full refund.</li>
              <li>
                Our support team will assist you in priority rebooking with
                another highly-rated professional.
              </li>
            </ul>
          </ContentSection>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;

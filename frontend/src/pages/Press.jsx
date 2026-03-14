import React from "react";
import PageHeader from "../components/PageHeader";
import SectionTitle from "../components/SectionTitle";
import { FileText } from "lucide-react";

const Press = () => {
  const breadcrumbs = [{ label: "Press Room" }];

  const pressReleases = [
    {
      date: "March 01, 2026",
      title:
        "HomeServiceHub Secures $50M Series B Funding to Expand National Footprint",
      source: "TechCrunch",
    },
    {
      date: "February 15, 2026",
      title:
        "The Future of the Gig Economy: How HomeServiceHub is Changing the Game",
      source: "Forbes",
    },
    {
      date: "January 28, 2026",
      title: "HomeServiceHub Named Best Startup Workplace of 2026",
      source: "Fast Company",
    },
    {
      date: "December 10, 2025",
      title:
        "New Integration Simplifies Background Checks for Service Professionals",
      source: "Wall Street Journal",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Press & Media"
        breadcrumbs={breadcrumbs}
        description="Latest news, announcements, and media resources from HomeServiceHub."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <SectionTitle title="Press Releases & Coverage" align="left" />

        <div className="mt-12 space-y-6">
          {pressReleases.map((release, index) => (
            <div
              key={index}
              className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                  {release.source}
                </span>
                <span className="text-sm text-gray-500">{release.date}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors cursor-pointer">
                {release.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <SectionTitle
            title="Media Contact"
            subtitle="Are you a journalist or media professional? Get in touch with our PR team."
          />
          <div className="mt-8">
            <a
              href="mailto:press@homeservicehub.com"
              className="inline-flex justify-center items-center px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              Email Press Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Press;

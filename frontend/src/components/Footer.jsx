import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const sections = [
    {
      title: "Company",
      links: [
        { label: "About Us", to: "/about" },
        { label: "Careers", to: "/careers" },
        { label: "Blog", to: "/blog" },
        { label: "Press", to: "/press" },
        { label: "Contact Us", to: "/contact" },
      ],
    },
    {
      title: "For Customers",
      links: [
        { label: "How it Works", to: "/how-it-works" },
        { label: "Service Categories", to: "/categories" },
        { label: "Help Center", to: "/help" },
        { label: "Safety", to: "/safety" },
        { label: "Support", to: "/support" },
      ],
    },
    {
      title: "For Professionals",
      links: [
        { label: "Become a Provider", to: "/provider/signup" },
        { label: "Provider Login", to: "/provider/login" },
        { label: "Provider Resources", to: "/provider/resources" },
        { label: "Partner With Us", to: "/partner" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", to: "/privacy" },
        { label: "Terms of Service", to: "/terms" },
        { label: "Refund Policy", to: "/refund-policy" },
        { label: "Cancellation Policy", to: "/cancellation-policy" },
      ],
    },
    {
      title: "Popular Cities",
      links: [
        { label: "Delhi", to: "/city/delhi" },
        { label: "Mumbai", to: "/city/mumbai" },
        { label: "Bangalore", to: "/city/bangalore" },
        { label: "Hyderabad", to: "/city/hyderabad" },
        { label: "Chennai", to: "/city/chennai" },
        { label: "Pune", to: "/city/pune" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-white font-bold text-lg mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      to={link.to}
                      className="text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xl shadow-lg">
              🏠
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              Local<span className="text-indigo-400">ServiceHub</span>
            </span>
          </div>

          <div className="text-sm text-slate-400">
            &copy; 2026 LocalServiceHub. All rights reserved.
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all duration-300"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

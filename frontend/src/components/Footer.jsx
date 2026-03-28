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
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Newsletter Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center pb-16 border-b border-slate-800 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Stay in the loop</h2>
            <p className="text-slate-400">Join our newsletter for the latest service trends and exclusive offers.</p>
          </div>
          <form className="flex gap-3 max-w-md lg:ml-auto w-full">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-900/20">
              Subscribe
            </button>
          </form>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-8 mb-16">
          {sections.map((section, idx) => (
            <div key={idx} className={idx === sections.length - 1 ? "col-span-2 md:col-span-1" : ""}>
              <h3 className="text-white font-bold text-base uppercase tracking-widest mb-6 opacity-90">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      to={link.to}
                      className="text-sm hover:text-indigo-400 transition-colors duration-200 font-medium"
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
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xl shadow-lg ring-4 ring-indigo-900/20">
              🏠
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              Local<span className="text-indigo-400">ServiceHub</span>
            </span>
          </div>

          <div className="text-sm text-slate-500 font-medium order-3 md:order-2">
            &copy; 2026 LocalServiceHub. All rights reserved.
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 order-2 md:order-3">
            {[
              { icon: <Facebook size={18} />, color: "hover:bg-blue-600", label: "Facebook" },
              { icon: <Instagram size={18} />, color: "hover:bg-pink-600", label: "Instagram" },
              { icon: <Twitter size={18} />, color: "hover:bg-sky-500", label: "Twitter" },
              { icon: <Linkedin size={18} />, color: "hover:bg-blue-700", label: "Linkedin" }
            ].map((social, sIdx) => (
              <a
                key={sIdx}
                href="#"
                aria-label={social.label}
                className={`w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white ${social.color} transition-all duration-300 shadow-sm`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { ShieldCheck, ShieldAlert, Star, Briefcase, ExternalLink, Mail, Phone, Clock } from "lucide-react";
import Badge from "../common/Badge";
import Button from "../common/Button";

const AdminProvidersTab = ({ providers = [] }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">
            Provider Management
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Oversee all registered business entities and their service performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info" className="px-5 py-2.5 rounded-2xl text-[0.65rem] font-black uppercase tracking-[0.1em]">
            Total Entities: {providers.length}
          </Badge>
          <Badge variant="success" className="px-5 py-2.5 rounded-2xl text-[0.65rem] font-black uppercase tracking-[0.1em]">
            Verified: {providers.filter(p => p.isVerified).length}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {providers.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            <Briefcase size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No providers found</p>
          </div>
        ) : (
          providers.map((provider) => (
            <div 
              key={provider._id} 
              className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-500 relative overflow-hidden active:scale-[0.98]"
            >
              {/* Status Header */}
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg border-2 border-white group-hover:rotate-6 transition-transform">
                    {provider.businessName?.charAt(0) || "P"}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">
                      {provider.businessName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={provider.isVerified ? "success" : "warning"} 
                        className="px-3 py-1 rounded-lg text-[0.55rem] font-black uppercase tracking-widest"
                        icon={provider.isVerified ? ShieldCheck : ShieldAlert}
                      >
                        {provider.isVerified ? "Verified Entity" : "Pending Vetting"}
                      </Badge>
                      <div className="flex items-center gap-1 text-amber-500 ml-1">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-black">{provider.rating || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                    <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-1">Total Earnings</p>
                    <p className="text-lg font-black text-slate-900 leading-none">₹{provider.earnings?.toLocaleString() || 0}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 transition-colors group-hover:bg-white group-hover:border-indigo-100">
                  <p className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-1.5">Owner</p>
                  <p className="text-xs font-bold text-slate-700 truncate">{provider.user?.name || 'Unknown'}</p>
                </div>
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 transition-colors group-hover:bg-white group-hover:border-indigo-100">
                  <p className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-1.5">Reviews</p>
                  <p className="text-xs font-bold text-slate-700">{provider.numReviews || 0} Ratings</p>
                </div>
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 transition-colors group-hover:bg-white group-hover:border-indigo-100">
                  <p className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-1.5">Availability</p>
                  <p className="text-xs font-bold text-slate-700">{provider.availability?.days?.length || 0} Days</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-slate-500">
                    <Mail size={14} className="text-indigo-400" />
                    <span className="text-xs font-bold truncate">{provider.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <Phone size={14} className="text-indigo-400" />
                    <span className="text-xs font-bold">{provider.user?.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <Clock size={14} className="text-indigo-400" />
                    <span className="text-xs font-bold">Joined {new Date(provider.createdAt).toLocaleDateString()}</span>
                  </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-6 border-t border-slate-50 relative z-10">
                <Button 
                    variant="indigo" 
                    size="sm" 
                    className="flex-1 rounded-2xl font-black text-[0.65rem] uppercase tracking-widest py-3"
                    icon={ExternalLink}
                >
                    View Services
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 rounded-2xl font-black text-[0.65rem] uppercase tracking-widest py-3 border border-slate-100"
                >
                    Message
                </Button>
              </div>

              {/* Background Decoration */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-slate-50 rounded-full group-hover:bg-indigo-50/50 transition-colors duration-500" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminProvidersTab;

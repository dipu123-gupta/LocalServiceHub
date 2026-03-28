import { useState } from "react";
import { Search, Loader2, Edit, Trash2, Star, User, Briefcase } from "lucide-react";
import Button from "../common/Button";
import Badge from "../common/Badge";

const AdminServicesTab = ({ services = [], handleDeleteService, handleModerateService }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.provider?.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 transition-colors">
      <div className="p-10 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 transition-colors">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">
            Service Inventory
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Managing {services.length} platform assets
          </p>
        </div>
        
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input
            placeholder="Query Registry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-14 pr-6 text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:shadow-2xl focus:shadow-indigo-500/10 dark:focus:shadow-none transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md transition-colors">
              {["Asset Identity", "Taxonomy", "Custodian", "Status", "Management"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] border-b border-slate-100 dark:border-slate-800"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800">
            {filteredServices.map((s) => (
              <tr key={s._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all duration-300">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm group-hover:scale-110 group-hover:shadow-xl transition-all duration-500 relative">
                       {s.images?.[0]?.url ? (
                         <img 
                           src={s.images[0].url} 
                           alt={s.title}
                           className="w-full h-full object-cover"
                         />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                            <Briefcase size={20} className="text-slate-300 dark:text-slate-600" />
                         </div>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 dark:text-white text-lg tracking-tight leading-none mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {s.title}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg border border-amber-100/50 dark:border-amber-900/30">
                          <Star size={10} className="fill-amber-600 dark:fill-amber-400" /> {s.rating.toFixed(1)}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest opacity-60">
                          {s.numReviews} Global Reviews
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className="inline-block px-4 py-1.5 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 dark:shadow-none">
                    {s.category?.name || "Generic"}
                  </span>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                      <User size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200 leading-none mb-1">
                        {s.provider?.businessName || "Anonymous"}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Verified Partner</span>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex flex-col">
                    <Badge 
                      variant={s.moderationStatus === "approved" ? "success" : s.moderationStatus === "rejected" ? "danger" : "warning"}
                      className="px-3 py-1 uppercase tracking-widest text-[0.6rem] font-black w-fit mb-2"
                    >
                      {s.moderationStatus || "pending"}
                    </Badge>
                    <div className="text-xl font-black text-slate-950 dark:text-white tracking-tighter leading-none mb-1">
                      ₹{s.price.toLocaleString()}
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleModerateService(s._id, "approved")}
                      className="h-9 px-3 rounded-xl text-[10px] font-black"
                      disabled={s.moderationStatus === "approved"}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleModerateService(s._id, "rejected")}
                      className="h-9 px-3 rounded-xl text-[10px] font-black"
                      disabled={s.moderationStatus === "rejected"}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDeleteService(s._id)}
                      className="h-9 w-9 p-0 rounded-xl"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminServicesTab;

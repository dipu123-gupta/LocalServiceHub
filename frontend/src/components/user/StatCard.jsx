export const StatCard = ({ icon, label, value, bgClass = "bg-indigo-50" }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
    <div className={`w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div>
      <div className="text-2xl font-black text-slate-900 leading-none">
        {value}
      </div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1.5">
        {label}
      </div>
    </div>
  </div>
);

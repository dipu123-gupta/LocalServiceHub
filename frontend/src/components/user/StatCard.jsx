export const StatCard = ({ icon, label, value, bgClass = "bg-indigo-50" }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none flex items-center gap-4 transition-all hover:shadow-md dark:hover:shadow-none transition-colors duration-300">
    <div className={`w-12 h-12 rounded-xl ${bgClass} dark:bg-opacity-20 flex items-center justify-center shrink-0 transition-colors`}>
      {icon}
    </div>
    <div>
      <div className="text-2xl font-black text-slate-900 dark:text-white leading-none transition-colors">
        {value}
      </div>
      <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1.5 transition-colors">
        {label}
      </div>
    </div>
  </div>
);

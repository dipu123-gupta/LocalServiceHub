import React from "react";
import SupportTickets from "../../components/support/SupportTickets";

const Support = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
          Help & <span className="text-indigo-600 dark:text-indigo-400 font-black">Support</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-bold mt-2 transition-colors">
          Manage your disputes, technical issues and account queries.
        </p>
      </div>

      <SupportTickets />
    </div>
  );
};

export default Support;

import { MapPin, Search, Plus, Trash2, Globe, ArrowRight, X } from "lucide-react";
import Button from "../common/Button";
import Badge from "../common/Badge";
import InputField from "../common/InputField";

import { useState } from "react";

const AdminCitiesTab = ({
  cities = [],
  showCityForm,
  setShowCityForm,
  cityName,
  setCityName,
  cityState,
  setCityState,
  handleCreateCity,
  handleToggleCity,
  handleDeleteCity,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCities = cities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.state.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Operating Cities
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Configure service availability across geographical regions.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
            />
          </div>
          <Button
            onClick={() => setShowCityForm(!showCityForm)}
            icon={showCityForm ? X : Plus}
            variant={showCityForm ? "outline" : "primary"}
            className="w-full sm:w-auto rounded-2xl h-12 px-6"
          >
            {showCityForm ? "Cancel" : "Add New City"}
          </Button>
        </div>
      </div>

      {showCityForm && (
        <div className="p-8 bg-slate-50/50 border-b border-slate-100 animate-in slide-in-from-top-4 duration-300">
          <form
            onSubmit={handleCreateCity}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl"
          >
            <InputField
              label="City Name"
              required
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="e.g. Hyderabad"
              icon={MapPin}
            />
            <InputField
              label="State / Region"
              required
              value={cityState}
              onChange={(e) => setCityState(e.target.value)}
              placeholder="e.g. Telangana"
              icon={Globe}
            />
            <Button
              type="submit"
              className="h-14 rounded-2xl shadow-lg shadow-indigo-100/50"
            >
              Register City
            </Button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
              {["Region", "State / Territory", "Service Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-8 py-5 text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filteredCities.map((c) => (
              <tr key={c._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <MapPin size={20} />
                    </div>
                    <span className="font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">
                      {c.name}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    {c.state}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <button
                    onClick={() => handleToggleCity(c._id, c.isAvailable)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border-2 transition-all font-black text-[0.65rem] uppercase tracking-widest ${
                      c.isAvailable 
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40" 
                        : "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${c.isAvailable ? "bg-emerald-600 dark:bg-emerald-400 animate-pulse" : "bg-rose-600 dark:bg-rose-400"}`} />
                    {c.isAvailable ? "Operational" : "Suspended"}
                  </button>
                </td>
                <td className="px-8 py-6">
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDeleteCity(c._id)}
                    className="h-10 w-10 p-0 rounded-xl"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCitiesTab;

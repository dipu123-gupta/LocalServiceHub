import { Search, Plus, Trash2, Edit, X } from "lucide-react";
import Button from "../common/Button";
import Badge from "../common/Badge";
import InputField from "../common/InputField";

import { useState } from "react";

const AdminCategoriesTab = ({
  categories = [],
  showCatForm,
  setShowCatForm,
  catName,
  setCatName,
  catIcon,
  setCatIcon,
  handleCreateCategory,
  handleDeleteCategory,
  handleToggleCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Marketplace Categories
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage service categories and their visibility.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
            />
          </div>
          <Button
            onClick={() => setShowCatForm(!showCatForm)}
            icon={showCatForm ? X : Plus}
            variant={showCatForm ? "outline" : "primary"}
            className="w-full sm:w-auto rounded-2xl h-12 px-6"
          >
            {showCatForm ? "Cancel" : "New Category"}
          </Button>
        </div>
      </div>

      {showCatForm && (
        <div className="p-8 bg-slate-50/50 border-b border-slate-100 animate-in slide-in-from-top-4 duration-300">
          <form
            onSubmit={handleCreateCategory}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl"
          >
            <InputField
              label="Category Name"
              required
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. Home Cleaning"
            />
            <InputField
              label="Icon Identifier"
              required
              value={catIcon}
              onChange={(e) => setCatIcon(e.target.value)}
              placeholder="e.g. Sparkles"
              secondaryLabel="(Lucide Icon Name)"
            />
            <Button
              type="submit"
              className="h-14 rounded-2xl shadow-lg shadow-indigo-100/50"
            >
              Create Category
            </Button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              {["Visual", "Category Name", "Inventory", "Visibility", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-8 py-5 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em]"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredCategories.map((c) => (
              <tr key={c._id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {c.icon || "📦"}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="font-black text-slate-900 leading-tight">
                    {c.name}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <Badge variant="gray" className="font-black text-[0.6rem] px-2 py-0.5">
                      {c.servicesCount || 0}
                    </Badge>
                    <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">Services</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <button 
                    onClick={() => handleToggleCategory(c._id)}
                    className="focus:outline-none transition-transform active:scale-95"
                  >
                    <Badge 
                      variant={c.isActive ? "success" : "gray"}
                      className="px-3 py-1 uppercase tracking-widest text-[0.6rem] cursor-pointer hover:shadow-lg transition-all"
                    >
                      {c.isActive ? "Live" : "Hidden"}
                    </Badge>
                  </button>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Edit}
                      className="h-10 w-10 p-0 rounded-xl border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDeleteCategory(c._id)}
                      className="h-10 w-10 p-0 rounded-xl"
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

export default AdminCategoriesTab;

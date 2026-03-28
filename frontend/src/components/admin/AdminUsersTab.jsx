import { useState } from "react";
import { Search, CheckCircle, Trash2, ShieldAlert, Heart, User as UserIcon } from "lucide-react";
import Badge from "../common/Badge";
import Button from "../common/Button";

const AdminUsersTab = ({ users = [], handleDeleteUser, handleToggleBlockUser, userInfo }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
      <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Registered Users
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Total of {users.length} members across all roles.
          </p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50">
              {["User Profile", "Role", "Account Status", "Actions"].map((h) => (
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
            {filteredUsers.map((u) => (
              <tr key={u._id} className="group hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-colors">
                <td className="px-4 md:px-8 py-4 md:py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-lg font-black text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-black text-slate-900 dark:text-white leading-tight">
                        {u.name}
                      </div>
                      <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                        {u.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 md:px-8 py-4 md:py-6">
                  <Badge 
                    variant={u.role === "admin" ? "danger" : u.role === "provider" ? "info" : "success"}
                    className="px-3 py-1 uppercase tracking-widest text-[0.6rem] font-black"
                  >
                    {u.role}
                  </Badge>
                </td>
                <td className="px-4 md:px-8 py-4 md:py-6">
                  {u.isBlocked ? (
                    <div className="flex items-center gap-2.5 text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest bg-rose-50 dark:bg-rose-900/20 w-fit px-3 py-1.5 rounded-lg border border-rose-100 dark:border-rose-900/50 italic">
                      <ShieldAlert size={14} className="fill-rose-600 dark:fill-rose-400 text-white dark:text-slate-900" />
                      Blocked
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 w-fit px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                      <CheckCircle size={14} className="fill-emerald-600 dark:fill-emerald-400 text-white dark:text-slate-900" />
                      Active
                    </div>
                  )}
                  {u.isEmailVerified && (
                     <div className="mt-1 text-[0.6rem] font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1">
                        <CheckCircle size={10} className="text-emerald-500 dark:text-emerald-400" />
                        Email Verified
                     </div>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <Button
                      variant={u.isBlocked ? "success" : "warning"}
                      size="sm"
                      icon={u.isBlocked ? CheckCircle : ShieldAlert}
                      onClick={() => handleToggleBlockUser(u._id)}
                      disabled={u._id === userInfo._id}
                      className="h-10 w-10 p-0 rounded-xl"
                      title={u.isBlocked ? "Unblock User" : "Block User"}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDeleteUser(u._id)}
                      disabled={u._id === userInfo._id}
                      className="h-10 w-10 p-0 rounded-xl shadow-lg shadow-rose-100"
                      title="Delete Permanently"
                    />
                    {u._id === userInfo._id && (
                      <span className="text-[0.6rem] font-black text-rose-500 uppercase tracking-tighter">You (Protected)</span>
                    )}
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

export default AdminUsersTab;

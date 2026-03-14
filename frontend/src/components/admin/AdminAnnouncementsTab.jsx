import { Send, Loader2, Trash2, Megaphone, Users, User, UserCheck, Calendar, Radio } from "lucide-react";
import api from "../../services/api";
import Button from "../common/Button";
import Badge from "../common/Badge";
import InputField from "../common/InputField";

const AdminAnnouncementsTab = ({
  announcements = [],
  announcementForm,
  setAnnouncementForm,
  isSendingAnnouncement,
  handleCreateAnnouncement,
  fetchAllData,
}) => {
  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    try {
      await api.delete(`/announcements/${id}`);
      fetchAllData(); // refresh list
    } catch (err) {
      alert("Failed to delete announcement");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Create Form */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm sticky top-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
            <Megaphone size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Broadcast</h3>
            <p className="text-slate-500 text-sm font-medium">Send alerts to the community</p>
          </div>
        </div>

        <form onSubmit={handleCreateAnnouncement} className="space-y-6">
          <InputField
            label="Announcement Title"
            required
            value={announcementForm.title}
            onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
            placeholder="e.g. Schedule Maintenance"
          />

          <div className="space-y-2">
            <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest ml-1">
              Broadcasting Content
            </label>
            <textarea
              required
              rows="5"
              value={announcementForm.message}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
              placeholder="Write your message here..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest ml-1">
              Target Segment
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: "all", label: "Global (Everyone)", icon: Radio },
                { id: "user", label: "Customers Only", icon: Users },
                { id: "provider", label: "Service Providers", icon: UserCheck }
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setAnnouncementForm({ ...announcementForm, targetRole: role.id })}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-sm font-black text-left ${
                    announcementForm.targetRole === role.id 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                      : "bg-white border-slate-100 text-slate-500 hover:border-indigo-100 hover:bg-slate-50"
                  }`}
                >
                  <role.icon size={20} className={announcementForm.targetRole === role.id ? "text-white" : "text-slate-400"} />
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isSendingAnnouncement}
            icon={Send}
            className="w-full h-14 rounded-2xl shadow-xl shadow-indigo-100/50"
          >
            Broadcast Message
          </Button>
        </form>
      </div>

      {/* History */}
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Announcement History</h3>
            <p className="text-slate-500 text-sm font-medium">Logs of all previous broadcasts</p>
          </div>
          <Badge variant="gray" className="px-4 py-1.5">{announcements.length} Total</Badge>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {announcements.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 border-dashed">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Megaphone className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No history found</p>
            </div>
          ) : (
            announcements.map((a) => (
              <div
                key={a._id}
                className="group relative bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/40 transition-all hover:border-indigo-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className={`px-3 py-1 rounded-lg text-[0.6rem] font-black uppercase tracking-[0.2em] border shadow-sm ${
                      a.targetRole === "all" ? "bg-slate-900 text-white border-slate-900" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                    }`}>
                      {a.targetRole}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <Calendar size={14} className="text-slate-300" />
                      {new Date(a.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteAnnouncement(a._id)}
                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <h4 className="text-lg font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {a.title}
                </h4>
                <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {a.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncementsTab;

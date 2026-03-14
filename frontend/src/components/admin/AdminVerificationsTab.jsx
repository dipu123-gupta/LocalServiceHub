import { CheckCircle, XCircle, FileText, ExternalLink } from "lucide-react";
import api from "../../services/api";
import Button from "../common/Button";
import Badge from "../common/Badge";

const AdminVerificationsTab = ({ pendingProviders = [], setPendingProviders }) => {
  const handleVerifyProvider = async (id, status) => {
    try {
      if (!window.confirm(`Are you sure you want to ${status} this provider?`)) return;
      await api.put(`/service-providers/${id}/verify`, { status });
      setPendingProviders(pendingProviders.filter((p) => p._id !== id));
      alert(`Provider status updated to ${status}`);
    } catch (err) {
      alert("Failed to update provider status");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Verification Requests
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {pendingProviders.length} providers waiting for manual review.
          </p>
        </div>
      </div>

      {pendingProviders.length === 0 ? (
        <div className="text-center py-20 px-6">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <CheckCircle className="text-slate-300" size={32} />
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Inbox Zero: No pending verifications
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                {["Provider Entity", "Business Name", "Skills & Services", "Financial Details", "Documentation", "Decision"].map(
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
              {pendingProviders.map((p) => (
                <tr key={p._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-900 leading-tight">
                      {p.user?.name}
                    </div>
                    <div className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                      {p.user?.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        🏢
                      </div>
                      <span className="font-bold text-slate-700">{p.businessName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {p.skills?.length > 0 ? p.skills.map((s, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white border border-slate-100 rounded-md text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                          {s}
                        </span>
                      )) : <span className="text-[10px] text-slate-300 italic">No skills listed</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-slate-900 leading-none">{p.bankDetails?.bankName || 'N/A'}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.bankDetails?.accountNumber || 'Account N/A'}</div>
                      <div className="text-[8px] font-black text-indigo-500">{p.bankDetails?.ifscCode || 'IFSC N/A'}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      {p.documents.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors group/link"
                        >
                          <FileText size={14} className="group-hover/link:animate-bounce" />
                          <span className="underline underline-offset-4">{doc.name}</span>
                          <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => handleVerifyProvider(p._id, "verified")}
                        size="sm"
                        variant="success"
                        icon={CheckCircle}
                        className="rounded-xl px-4 font-black text-[0.65rem]"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleVerifyProvider(p._id, "rejected")}
                        size="sm"
                        variant="danger"
                        icon={XCircle}
                        className="rounded-xl px-4 font-black text-[0.65rem]"
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminVerificationsTab;

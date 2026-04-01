import { Download, FileText, CheckCircle, ShieldCheck, Printer, X, Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { bookingService } from "../../services/bookingService";
import toast from "react-hot-toast";
import { useState } from "react";

const BookingInvoice = ({ isOpen, onClose, booking }) => {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !booking) return null;

  const basePrice =
    booking.totalAmount -
    (booking.additionalCharges
      ?.filter((c) => c.approvalStatus === "approved")
      .reduce((sum, c) => sum + c.price, 0) || 0);
  const approvedExtra =
    booking.additionalCharges?.filter((c) => c.approvalStatus === "approved") ||
    [];
  // basePrice/approvedExtra already render the breakdown; keep calculations minimal.

  // Tax calculation (Inclusive 18% GST)
  const totalAmount = booking.totalAmount;
  const subtotal = totalAmount / 1.18;
  const gstAmount = totalAmount - subtotal;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const data = await bookingService.downloadInvoice(booking._id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${booking._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Invoice downloaded successfully!");
    } catch {
      toast.error("Failed to download PDF invoice");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 print:p-0">
        <div
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md print:hidden"
        />
        
        <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 print:shadow-none print:border-none print:rounded-none transition-colors">
          {/* Action Header (Hidden on Print) */}
          <div className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-slate-800 print:hidden bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <FileText size={18} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Digital Receipt</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDownload}
                disabled={downloading}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all border border-transparent shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2 group disabled:opacity-50"
              >
                {downloading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Download PDF</span>
              </button>
              <button 
                onClick={handlePrint}
                className="p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-2 group"
              >
                <Printer size={16} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Print</span>
              </button>
              <button 
                onClick={onClose}
                className="p-3 bg-white dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-10 sm:p-16 print:p-8" id="invoice-content">
            {/* Invoice Header */}
            <div className="flex flex-col md:flex-row justify-between gap-10 mb-16">
               <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                      <ShieldCheck size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">HomeServiceHub</h2>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-900 dark:text-white">Transaction Reference</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{booking.invoiceId || "INV-"+booking._id.slice(-10)}</p>
                  </div>
               </div>
               <div className="md:text-right">
                  <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-widest uppercase mb-4 opacity-10">INVOICE</h1>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Issue</p>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                        {new Date(booking.updatedAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking Status</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        <CheckCircle size={10} />
                        Paid & Completed
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 border-y border-slate-50 dark:border-slate-800 py-12 transition-colors">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Customer Details</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">{booking.user?.name}</p>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2">{booking.address?.line1}</p>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{booking.address?.city}, {booking.address?.state}</p>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">Contact: {booking.contactNumber}</p>
               </div>
               <div className="md:text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Service Provider</p>
                   <p className="text-lg font-black text-slate-900 dark:text-white">{booking.provider?.businessName || booking.provider?.name || "Verified Professional"}</p>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2">HomeServiceHub Partner Network</p>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Verified & Insured Professional</p>
                  <div className="flex items-center gap-2 justify-end mt-4">
                     <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Reg ID: {booking.provider?._id?.slice(-6).toUpperCase() || "HSH-PAR-992"}</div>
                  </div>
               </div>
            </div>

            {/* Table */}
            <div className="mb-16">
               <table className="w-full">
                  <thead>
                     <tr className="border-b-2 border-slate-900 dark:border-white transition-colors">
                        <th className="py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Description</th>
                        <th className="py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                        <th className="py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price</th>
                        <th className="py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800 transition-colors">
                     <tr className="group">
                        <td className="py-8">
                           <p className="text-base font-black text-slate-800 dark:text-slate-100">{booking.service?.title}</p>
                           <p className="text-xs font-bold text-slate-400 mt-1">Standard Professional Service</p>
                        </td>
                        <td className="py-8 text-right font-black text-slate-800 dark:text-slate-200">1</td>
                        <td className="py-8 text-right font-black text-slate-800 dark:text-slate-200">₹{basePrice.toLocaleString()}</td>
                        <td className="py-8 text-right font-black text-slate-800 dark:text-slate-200">₹{basePrice.toLocaleString()}</td>
                     </tr>
                     {approvedExtra.map((item, idx) => (
                        <tr key={idx} className="group">
                           <td className="py-6">
                              <p className="text-sm font-black text-slate-800 dark:text-slate-200">{item.item}</p>
                              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Approved Material</p>
                           </td>
                           <td className="py-6 text-right font-black text-slate-800 dark:text-slate-200">1</td>
                           <td className="py-6 text-right font-black text-slate-800 dark:text-slate-200">₹{item.price.toLocaleString()}</td>
                           <td className="py-6 text-right font-black text-slate-800 dark:text-slate-200">₹{item.price.toLocaleString()}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* Footer Summary */}
            <div className="flex flex-col md:flex-row justify-between gap-12 pt-10 border-t border-slate-900 dark:border-white/30 transition-colors">
               <div className="md:max-w-xs">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Payment Info</p>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                    <p className="text-xs font-black text-slate-900 dark:text-white mb-1">Method: {booking.paymentMethod}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payment successfully processed via secure platform gateway.</p>
                  </div>
               </div>
               <div className="md:w-72 space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500 dark:text-slate-400">
                     <span>Subtotal</span>
                     <span className="text-slate-900 dark:text-white">₹{subtotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500 dark:text-slate-400">
                     <span>GST (18% inclusive)</span>
                     <span className="text-slate-900 dark:text-white">₹{gstAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                     <span className="text-xl font-black text-slate-900 dark:text-white tracking-widest uppercase">Total</span>
                     <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">₹{booking.totalAmount.toLocaleString()}</span>
                  </div>
               </div>
            </div>

            {/* Legal / Note */}
            <div className="mt-20 pt-10 border-t border-slate-50 dark:border-slate-800 text-center">
               <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">Thank you for choosing HomeServiceHub</p>
               <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 mt-4 max-w-sm mx-auto leading-relaxed">
                  This is a computer-generated invoice and does not require a physical signature. HomeServiceHub serves as a facilitator platform between independent service professionals and customers.
               </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default BookingInvoice;

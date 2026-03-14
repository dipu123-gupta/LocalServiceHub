import { Component } from "react";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 md:p-12 text-center overflow-hidden relative">
          {/* Background Gradient Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-[2rem] bg-rose-50 flex items-center justify-center mx-auto mb-10 shadow-xl shadow-rose-500/5 relative group">
               <div className="absolute inset-0 bg-rose-500/10 rounded-[2rem] animate-ping opacity-20" />
               <AlertTriangle size={48} className="text-rose-500 stroke-[1.5]" />
            </div>

            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter leading-none italic">
              Unexpected Interruption
            </h2>
            
            <p className="text-lg font-medium text-slate-500 mb-12 max-w-md mx-auto leading-relaxed">
              We've encountered a system anomaly. Please try refreshing or return to the cockpit.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button
                onClick={() => window.location.reload()}
                className="group h-14 px-10 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-3 active:scale-95"
              >
                <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-700 font-sans" />
                Refresh Engine
              </button>
              
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = "/";
                }}
                className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-900/40 hover:bg-black transition-all flex items-center gap-3 active:scale-95"
              >
                <Home size={16} />
                Return to Home
              </button>
            </div>
            
            <div className="mt-16 pt-8 border-t border-slate-100/50">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Technical Signature Recorded</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

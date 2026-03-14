import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Loader2,
  Clock,
  Layers,
  IndianRupee,
  AlertCircle,
  X,
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import ServiceModal from "../../components/provider/ServiceModal";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/services/my");
      setServices(data);
    } catch (err) {
      console.error("Failed to load services", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete service. Please try again.");
    }
  };

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            My <span className="text-indigo-600">Services</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2">
            Managed {services.length} active service listings across the platform.
          </p>
        </div>
        <button 
          onClick={() => {
            setSelectedService(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-indigo-200 hover:bg-slate-900 transition-all active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          Create Service
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text"
            placeholder="Search your services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all shadow-sm"
          />
        </div>
        <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-sm text-slate-600 flex items-center gap-3 hover:bg-slate-50 transition-all">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Service List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Loader2 size={40} className="text-indigo-600 animate-spin" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Syncing your portfolio...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 p-20 text-center">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Layers size={40} className="text-indigo-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">No Services Found</h3>
          <p className="text-slate-500 font-bold max-w-sm mx-auto mb-8">
            You haven't added any services yet. Start adding services to get your first booking!
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-xl"
          >
            Add Your First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={service._id}
                className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 transition-all duration-500 relative"
              >
                {/* Image Section */}
                <div className="h-56 relative overflow-hidden">
                  {service.images?.[0] ? (
                    <img 
                      src={service.images[0].url} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">
                        {service.category?.name}
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="flex gap-2 w-full">
                      <button 
                        onClick={() => {
                          setSelectedService(service);
                          setIsModalOpen(true);
                        }}
                        className="flex-1 py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl font-black text-xs hover:bg-white hover:text-slate-900 transition-all active:scale-95"
                      >
                        Edit Listing
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                      {service.title}
                    </h4>
                    <span className={`w-3 h-3 rounded-full ${service.isActive ? "bg-emerald-500" : "bg-slate-300"} shadow-sm`} />
                  </div>
                  <p className="text-slate-500 font-bold text-xs line-clamp-2 mb-8 h-10">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <IndianRupee size={16} strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Price/Job</p>
                        <p className="text-lg font-black text-slate-900 leading-none">₹{service.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        <Clock size={12} />
                        Duration
                      </div>
                      <p className="text-sm font-black text-slate-700 leading-none">{service.duration} mins</p>
                    </div>
                  </div>
                </div>

                {/* Quick Deletion */}
                <button 
                  onClick={() => handleDelete(service._id)}
                  className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-900 scale-75 group-hover:scale-100 active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Service Modal */}
      {isModalOpen && (
        <ServiceModal 
          service={selectedService} 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
          onSuccess={fetchServices}
        />
      )}
    </div>
  );
};

export default Services;

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Star, Clock, MapPin, Heart } from "lucide-react";
import api from "@/utils/api";
import { setCredentials } from "../store/authSlice";
import { useSocket } from "../store/context/SocketContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ServiceCard = ({ service }) => {
  const { userInfo } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();

  const [providerStatus, setProviderStatus] = useState(
    service.provider?.status || "offline",
  );

  useEffect(() => {
    if (!socket) return;
    const handleStatusUpdate = (data) => {
      const providerId =
        typeof service.provider === "object"
          ? service.provider?._id
          : service.provider;
      if (data.providerId === providerId) {
        setProviderStatus(data.status);
      }
    };
    socket.on("providerStatusUpdated", handleStatusUpdate);
    return () => socket.off("providerStatusUpdated", handleStatusUpdate);
  }, [socket, service.provider]);

  const isFavorite = userInfo?.favorites?.includes(service._id);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userInfo) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/users/favorites", {
        serviceId: service._id,
      });
      // Update local storage/state via dispatch
      const updatedFavorites = isFavorite
        ? userInfo.favorites.filter((id) => id !== service._id)
        : [...userInfo.favorites, service._id];

      dispatch(setCredentials({ ...userInfo, favorites: updatedFavorites }));
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 flex flex-col shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 hover:-translate-y-2 h-full"
    >
      {/* Image Container */}
      <div className="relative h-56 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
        {service.images?.length > 0 ? (
          <img
            src={
              typeof service.images[0] === "string"
                ? service.images[0]
                : service.images[0]?.url
            }
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl grayscale opacity-50">
            🏠
          </div>
        )}

        {/* Favorite Heart */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 z-10 group/heart"
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${
              isFavorite
                ? "fill-red-500 stroke-red-500"
                : "stroke-slate-400 group-hover/heart:stroke-red-400"
            }`}
          />
        </button>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-lg border border-white/50">
          <Star size={14} className="fill-amber-400 stroke-amber-400" />
          <span className="text-sm font-bold text-slate-800">
            {service.rating?.toFixed(1) || "4.8"}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            ({service.numReviews || 0})
          </span>
        </div>

        {/* Category Overlay */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-xl shadow-indigo-200/50">
            {service.category?.name || "Service"}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-2">
          {service.description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-50">
          <div className="flex items-center gap-2 text-slate-600">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Clock size={14} className="text-indigo-600" />
            </div>
            <span className="text-xs font-semibold">
              {service.duration || 60} min
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 justify-end">
            <div className="relative">
              <div
                title={`Provider is ${providerStatus}`}
                className={`w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm ${
                  providerStatus === "online"
                    ? "bg-emerald-500 shadow-emerald-200"
                    : providerStatus === "busy"
                      ? "bg-amber-500 shadow-amber-200"
                      : "bg-slate-300 shadow-slate-100"
                }`}
              />
              {providerStatus === "online" && (
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-40" />
              )}
            </div>
            <span className="text-xs font-semibold truncate max-w-[80px]">
              {service.provider?.businessName || "Pro"}
            </span>
          </div>
        </div>

        {/* Footer Area */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              Starting at
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">
                ₹{service.price}
              </span>
            </div>
          </div>

          <Link
            to={`/services/${service._id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-indigo-200 active:scale-95"
          >
            Details
          </Link>
        </div>

        {/* Distance Badge (Absolute if present) */}
        {service.distance != null && (
          <div className="mt-4 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
            <MapPin size={12} className="text-indigo-500" />
            <span className="text-[11px] font-bold text-indigo-600">
              {service.distance < 1
                ? "< 1 km away"
                : `${(Math.round(service.distance * 10) / 10).toFixed(1)} km away`}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ServiceCard;

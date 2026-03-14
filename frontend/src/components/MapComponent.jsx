import React, { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MapComponent = ({
  center = { lat: 28.6139, lng: 77.209 }, // Default to New Delhi
  zoom = 12,
  markers = [],
  onLocationSelect = null,
  height = "300px",
  width = "100%",
  readOnly = false,
}) => {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  // Store markers to clean them up when new ones are passed
  const mapMarkersRef = useRef([]);

  const renderMarkers = () => {
    if (!googleMapRef.current || !window.google) return;

    // Clear existing markers
    mapMarkersRef.current.forEach((marker) => marker.setMap(null));
    mapMarkersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: googleMapRef.current,
        title: markerData.title || "",
        animation: window.google.maps.Animation.DROP,
      });

      if (markerData.info) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div class="p-2 font-sans"><p class="font-black text-slate-900">${markerData.info}</p></div>`,
        });
        marker.addListener("click", () => {
          infoWindow.open(googleMapRef.current, marker);
        });
      }

      mapMarkersRef.current.push(marker);
    });
  };

  useEffect(() => {
    // Function to initialize map
    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [{ color: "#ffffff" }, { lightness: 17 }],
          },
        ],
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
      });

      googleMapRef.current = map;

      // Add click listener if onLocationSelect is provided and not readonly
      if (!readOnly && onLocationSelect) {
        map.addListener("click", (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          onLocationSelect({ lat, lng });
        });
      }

      renderMarkers();
      setIsLoaded(true);
    };

    // Load script dynamically
    if (!window.google) {
      const scriptId = "google-maps-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        script.onerror = () => setMapError("Failed to load Google Maps");
        document.head.appendChild(script);
      } else {
        const checkGoogle = setInterval(() => {
          if (window.google) {
            clearInterval(checkGoogle);
            initMap();
          }
        }, 100);
      }
    } else {
      initMap();
    }
  }, [readOnly]);

  useEffect(() => {
    if (!isLoaded || !googleMapRef.current) return;

    if (center.lat && center.lng) {
      googleMapRef.current.panTo(center);
    }

    renderMarkers();
  }, [center, markers, isLoaded]);

  if (mapError) {
    return (
      <div 
        className="w-full h-full bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center"
        style={{ height, width }}
      >
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-4">
           <AlertCircle size={32} />
        </div>
        <h4 className="text-lg font-black text-slate-900 mb-2">Maps Unavailable</h4>
        <p className="text-sm font-medium text-slate-500 max-w-xs">{mapError}</p>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 group"
      style={{ width, height }}
    >
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center z-50 backdrop-blur-sm"
          >
            <div className="relative">
               <Loader2 size={48} className="text-indigo-600 animate-spin" />
               <motion.div 
                 animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 rounded-full border-2 border-indigo-200"
               />
            </div>
            <span className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Synchronizing Spatial Data
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div ref={mapRef} className="w-full h-full" />

      {/* Premium Overlay Accent */}
      <div className="absolute top-6 left-6 pointer-events-none">
         <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white shadow-lg flex items-center gap-2">
            <MapPin size={14} className="text-rose-500" />
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Live Preview</span>
         </div>
      </div>
    </div>
  );
};

export default MapComponent;

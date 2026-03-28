import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { serviceService } from "../services/serviceService";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import FeatureBanner from "../components/home/FeatureBanner";
import CategoriesSection from "../components/home/CategoriesSection";
import CategoryRow from "../components/home/CategoryRow";
import HowItWorks from "../components/home/HowItWorks";
import TrustSection from "../components/home/TrustSection";
import Testimonials from "../components/home/Testimonials";
import CTABanner from "../components/home/CTABanner";
import { Loader2 } from "lucide-react";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userCity, setUserCity] = useState(
    localStorage.getItem("userCity") || "",
  );
  const [localCity, setLocalCity] = useState(
    localStorage.getItem("userCity") || "",
  );

  useEffect(() => {
    const handleCityChange = () => {
      setUserCity(localStorage.getItem("userCity") || "");
      setLocalCity(localStorage.getItem("userCity") || "");
    };
    window.addEventListener("cityChange", handleCityChange);
    return () => window.removeEventListener("cityChange", handleCityChange);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const uCity = localStorage.getItem("userCity");
        const uLat = localStorage.getItem("userLat");
        const uLng = localStorage.getItem("userLng");

        const queryParams = {};
        if (uCity && uCity !== "Select City") {
          queryParams.city = uCity;
        }
        if (uLat) queryParams.lat = uLat;
        if (uLng) queryParams.lng = uLng;

        // Fetch categories and services in parallel
        const [categoriesData, servicesData] = await Promise.all([
          serviceService.getCategories(),
          serviceService.getServices(queryParams),
        ]);

        setCategories(categoriesData);
        setServices(servicesData);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userCity]);

  // Group services by category
  const servicesByCategory = (categoryId) => {
    return services.filter(service => 
      service.category === categoryId || service.category?._id === categoryId
    );
  };

  return (
    <div className="font-inter bg-white dark:bg-slate-950 transition-colors duration-300">
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        localCity={localCity}
        setLocalCity={setLocalCity}
      />
      <StatsSection />
      {/* <HowItWorks /> */}
      <CategoriesSection categories={categories} isLoading={isLoading} />
      
      <section className="py-24 px-6 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Curating professional services...</p>
          </div>
        ) : (
          categories.map(category => (
            <CategoryRow 
              key={category._id} 
              category={category} 
              services={servicesByCategory(category._id)} 
            />
          ))
        )}
      </section>

      <TrustSection />
      <Testimonials />
      <CTABanner />
    </div>
  );
};

export default Home;

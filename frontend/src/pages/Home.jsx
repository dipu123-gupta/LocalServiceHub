import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { serviceService } from "../services/serviceService";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import FeatureBanner from "../components/home/FeatureBanner";
import CategoriesSection from "../components/home/CategoriesSection";
import TopServicesSection from "../components/home/TopServicesSection";
import CTABanner from "../components/home/CTABanner";

const Home = () => {
  const [topServices, setTopServices] = useState([]);
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
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const uCity = localStorage.getItem("userCity");
        const uLat = localStorage.getItem("userLat");
        const uLng = localStorage.getItem("userLng");

        let params = [];
        if (uCity && uCity !== "Select City")
          params.push(`city=${encodeURIComponent(uCity)}`);
        if (uLat && uLng) {
          params.push(`lat=${uLat}&lng=${uLng}`);
        }
        const qs =
          params.length > 0
            ? Object.fromEntries(params.map((p) => p.split("=")))
            : {};
        const data = await serviceService.getServices(qs);
        setTopServices(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [userCity]);

  return (
    <div className="font-inter">
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        localCity={localCity}
        setLocalCity={setLocalCity}
      />
      <StatsSection />
      <FeatureBanner />
      <CategoriesSection />
      <TopServicesSection isLoading={isLoading} topServices={topServices} />
      <CTABanner />
    </div>
  );
};

export default Home;

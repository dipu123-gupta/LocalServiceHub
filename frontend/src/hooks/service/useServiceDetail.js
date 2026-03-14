import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";
import { serviceService } from "../../services/serviceService";
import { reviewService } from "../../services/reviewService";
import { bookingService } from "../../services/bookingService";
import { couponService } from "../../services/couponService";
import { userService } from "../../services/userService";

const useServiceDetail = (id, userInfo, navigate) => {
  const dispatch = useDispatch();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const isFavorite = userInfo?.favorites?.includes(id);

  // Booking form state
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [contactNumber, setContactNumber] = useState(userInfo?.phone || "");
  const [contactName, setContactName] = useState(userInfo?.name || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [mapLocation, setMapLocation] = useState(null);
  const [notes, setNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sData, rData] = await Promise.all([
          serviceService.getServiceById(
            `${id}?city=${city || userInfo?.city || ""}`,
          ),
          reviewService.getServiceReviews(id),
        ]);
        setService(sData);
        setReviews(rData);
      } catch (err) {
        setError("Service not found or an error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, city, userInfo?.city]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const data = await couponService.validateCoupon({
        code: couponCode,
        amount: service.price,
      });
      setDiscount(data.discount);
      setCouponApplied(true);
    } catch (err) {
      setCouponError(err.extractedMessage || err.message || "Invalid coupon");
      setDiscount(0);
      setCouponApplied(false);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      navigate("/login");
      return;
    }
    if (!bookingDate || !bookingTime || !address || !city) {
      setBookingError("Please fill all required booking fields.");
      return;
    }

    setBookingLoading(true);
    setBookingError("");
    try {
      const surgePrice = service.price * (service.surgeMultiplier || 1);
      const bookingData = {
        serviceId: service._id,
        serviceProviderId: service.provider?._id,
        bookingDate,
        timeSlot: bookingTime,
        contactNumber,
        notes,
        address: {
          street: address,
          city,
          zipCode,
          location: mapLocation
            ? { type: "Point", coordinates: [mapLocation.lng, mapLocation.lat] }
            : undefined,
        },
        totalAmount: surgePrice - discount,
        paymentMethod: paymentMethod,
        couponCode: couponApplied ? couponCode : undefined,
      };
      const newBooking = await bookingService.createBooking(bookingData);

      if (paymentMethod === "Razorpay" || paymentMethod === "stripe") {
        navigate(`/checkout/${newBooking._id}`);
      } else {
        setBookingSuccess(true);
      }
    } catch (err) {
      setBookingError(
        err.extractedMessage ||
          err.message ||
          "Booking failed. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    try {
      await userService.toggleFavorite({ serviceId: id });
      const updatedFavorites = isFavorite
        ? userInfo.favorites.filter((fid) => fid !== id)
        : [...userInfo.favorites, id];
      dispatch(setCredentials({ ...userInfo, favorites: updatedFavorites }));
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const handleStartChat = () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    navigate("/dashboard", {
      state: { activeTab: "chat", recipientId: service.provider?._id },
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment) return;

    setIsReviewLoading(true);
    setReviewError("");
    try {
      await reviewService.createReview({
        rating: reviewRating,
        comment: reviewComment,
        serviceId: id,
      });
      setReviewSuccess(true);
      setReviewComment("");
      const data = await reviewService.getServiceReviews(id);
      setReviews(data);
    } catch (err) {
      setReviewError(
        err.extractedMessage ||
          err.message ||
          "Failed to post review. Ensure you have completed a booking for this service.",
      );
    } finally {
      setIsReviewLoading(false);
    }
  };

  return {
    service,
    reviews,
    isLoading,
    error,
    isFavorite,
    bookingDate,
    setBookingDate,
    bookingTime,
    setBookingTime,
    contactNumber,
    setContactNumber,
    contactName,
    setContactName,
    address,
    setAddress,
    city,
    setCity,
    zipCode,
    setZipCode,
    mapLocation,
    setMapLocation,
    notes,
    setNotes,
    bookingLoading,
    bookingSuccess,
    bookingError,
    paymentMethod,
    setPaymentMethod,
    couponCode,
    setCouponCode,
    discount,
    couponLoading,
    couponApplied,
    couponError,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    isReviewLoading,
    reviewSuccess,
    reviewError,
    handleApplyCoupon,
    handleBooking,
    toggleFavorite,
    handleStartChat,
    handleReviewSubmit,
  };
};

export default useServiceDetail;

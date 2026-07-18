"use client";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useState } from "react";
import { RootState } from "@/redux/store";
import { SiSubtitleedit } from "react-icons/si";
import { useParams } from "next/navigation";
import { IProduct } from "@/model/product.model";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Calendar } from "lucide-react";
import { FaBookOpen } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight, FaStore, FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import UseGetAllProducts from "../../../hooks/UseGetAllProductsData";
import {
  HiShoppingCart,
  HiBolt,
} from "react-icons/hi2"
import {
  MessageSquareText,
  Image as ImageIcon,
  Send,
  Star,
  UploadCloud,
  User,
} from "lucide-react"; // Modern icons

import { FaRegStar, FaRocket, FaUserCircle } from "react-icons/fa";
import {
  FaTruck,
  FaMoneyBillWave,
  FaShieldAlt,
  FaExchangeAlt,
  FaTag,
  FaBox,
  FaCreditCard,
  FaStar,
  FaInfoCircle,
  FaShoppingCart,
  FaStar as FaStarSolid,
  FaBolt,
} from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";
// import { motion } from "motion/react";
import ProductCard from "@/component/ProductCard";
import { setUser } from "@/redux/userSlice";
import { setAllProductsData } from "@/redux/vendorSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

function ViewProduct() {
  const { userData: user } = useSelector((state: RootState) => state.user);

  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  UseGetAllProducts();
  const productId = params.id;
  const { allProductsData } = useSelector((state: RootState) => state.vendor);
  const product: IProduct | undefined = allProductsData?.find(
    (p: IProduct) => String(p._id) === String(productId),
  );

  // reviewa rating
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [activeImage, setActiveImage] = useState(0);

  const handleSubmitReview = async () => {
    // Check if user is logged in (you might need to adjust based on your auth)
    if (!productId) {
      alert("Product not found");
      return;
    }

    if (reviewRating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!reviewComment || reviewComment.trim().length === 0) {
      alert("Please write a comment");
      return;
    }

    const formData = new FormData();
    formData.append("productId", String(productId));
    formData.append("rating", String(reviewRating));
    formData.append("comment", reviewComment);
    if (reviewImage) {
      formData.append("image", reviewImage);
    }
    setLoading(true);
    try {
      const result = await axios.post("/api/vendor/addReview", formData);
      setLoading(false);
      alert("Review added successfully");
      setPreview(null);
      setReviewComment("");
      setReviewRating(0);
      setReviewImage(null);

      // Refresh the product data to show the new review
      const productsResult = await axios.get("/api/vendor/allProduct");
      dispatch(setAllProductsData(productsResult.data.products));
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      const message = error.response?.data?.message || "Add Review Error";
      alert(message);
    }
  };

  // ✅ RELATED PRODUCTS (CATEGORY ke basis par)
  const relatedProducts =
    allProductsData?.filter(
      (p) => p?.category === product?.category && p?._id !== product?._id,
    ) || [];

  const totalReviews = product?.reviews?.length ?? 0;

  const avgRating =
    product && totalReviews > 0
      ? (
          product.reviews!.reduce(
            (sum: number, r: { rating: number }) => sum + r.rating,
            0,
          ) / totalReviews
        ).toFixed(1)
      : 0;

  const images: string[] = [
    product?.image1,
    // product?.image2,
    // product?.image3,
    // product?.image4,
  ].filter((img): img is string => Boolean(img));



      // added to cart ka hai
      
     const handleAddtoCart = async (e:React.MouseEvent) => {
        e.stopPropagation();
      try{
        const result = await axios.post("/api/user/cart/add",{
          productId: productId,
          quantity: 1
        })
        console.log(result.data)
        
        // Refresh user data to update cart count in navbar
        const userResult = await axios.get("/api/user/currentUser");
        dispatch(setUser(userResult.data.user));
        
        alert("Added to cart")
        router.push("/cart")

      }catch(error){
        console.log(error)
        alert("Failed to add to cart")
      }

     }








  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left side */}

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main image container - Size: 450x420 (Preserved) */}
            <motion.div
              className="relative w-full lg:w-[450px] h-[420px] bg-black rounded-lg mr-3 overflow-hidden flex items-center justify-center border border-white/10 group"
              whileHover={{
                boxShadow: "0px 0px 40px rgba(168, 85, 247, 0.6)",
                borderColor: "rgba(168, 85, 247, 0.2)", // Dimmed to let the laser shine
              }}
              transition={{ duration: 0.4 }}
            >
              {/* 1. THE SPINNING LASER RING LAYER */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,#a855f7_360deg)] animate-[spin_4s_linear_infinite]" />
              </div>

              {/* 2. THE INNER MASK (Protects the image from the spinning light) */}
              <div className="absolute inset-[2px] bg-[#050505] rounded-lg z-10 overflow-hidden flex items-center justify-center">
                {images.length > 0 ? (
                  <Image
                    src={images[activeImage] || ""}
                    alt={product?.title ?? "Product image"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="text-gray-500 text-center">
                    <p className="text-xl font-bold tracking-widest uppercase">
                      No Signal
                    </p>
                  </div>
                )}
              </div>

              {/* 3. HUD CORNER ACCENTS - Layered on top (z-20) */}
              <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-purple-500/60 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20" />
              <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-fuchsia-500/60 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20" />
            </motion.div>

            {/* Image thumbnails - Size: 40x20 (Preserved) */}
            {/* {images.length > 0 && (
              <div className="flex flex-row lg:flex-col gap-3 justify-center">
                {images.map((img, i) => (
                  <motion.div
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-40 h-20 border rounded-lg justify-center cursor-pointer overflow-hidden flex items-center transition-all duration-300
            ${activeImage === i ? "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "border-white/20"} `}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 0px 20px rgba(168, 85, 247, 0.4)",
                    }}
                  >
                    <Image
                      src={img}
                      alt={product?.title ?? "Product image"}
                      fill
                      className="object-contain"
                      priority
                    />
                    {/* Active selection glow overlay */}
                    {/* {activeImage === i && (
                      <div className="absolute inset-0 bg-purple-500/10 pointer-events-none" />
                    )}
                  </motion.div>
                ))}
              </div>
            )} */} 
          </div>

          {/* Right side */}
          {product && (
            <div className="lg:ml-2 lg:mt-2 ">
              <h1 className="text-3xl  text-white font-extrabold mb-3 flex items-center gap-3 hover:text-purple-600">
                <SiSubtitleedit className="text-purple-600 animate-bounce shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                {product?.title || "Unknown title"}

              </h1>
              <p className="text-gray-400 mb-2 flex items-center gap-2 font-extrabold">
                <FaBookOpen className="text-purple-400 animate-pulse   shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
                Expert: {product?.category}
              </p>

              <p className="text-green-500 text-2xl font-extrabold flex items-center gap-2 mt-2 mb-2">
                <FaCreditCard className="text-green-400 animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
                ₹ {""}
                {product?.price}
              </p>

              {/* <p className="mb-3 text-gray-50 flex items-center gap-2 font-extrabold">
                <FaBox className="text-orange-400 animate-pulse shadow-[0_0_15px_rgba(251,146,60,0.8)]" />
                Stock:{" "}
                <span
                  className={
                    product?.stock && product.stock > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {product?.stock && product.stock > 0
                    ? "Available"
                    : "Not Available"}
                </span>
              </p> */}

              {/* {typeof product?.replacementDays === "number" &&
                product.replacementDays > 0 && (
                  <div className="flex items-center gap-2 mb-0 mt-2 text-gray-300 font-extrabold">
                    <FaExchangeAlt className="text-red-400 animate-bounce shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
                    <span>Replacement Days: {product.replacementDays}</span>
                  </div>
                )} */}

              {/* {product?.freeDelivery === true && (
                <div className="flex items-center gap-2 mb-2 mt-2 text-gray-300 font-extrabold">
                  <FaTruck className="text-teal-400 animate-pulse shadow-[0_0_15px_rgba(20,184,166,0.8)]" />
                  <span>Free Delivery</span>
                </div>
              )} */}

              <div className="flex items-center gap-2 text-sm text-gray-400 border-t border-white/5 pt-2">
                <FaBriefcase
                  size={18}
                  className="text-blue-600 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                />
                <span className="text-[17px] text-bold text-gray-300 truncate">
                  Experience yr: {product.vendor?.gstNumber || "Unknown Vendor"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FaMapMarkerAlt
                  size={18}
                  className="text-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                />
                <span className="text-[17px] text-bold text-gray-300 mt-2 truncate">
                  {product.vendor?.shopAddress || "shop no "}
                </span>
              </div>
              {/* {product?.payOnDelivery === true && (
                <div className="flex items-center gap-2 mb-2 mt-2 text-gray-300">
                  <FaMoneyBillWave className="text-purple-400 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                  <span>Cash on Delivery Available</span>
                </div>
              )} */}


              {/* <div className="">
              {product && product.warrenty !== undefined && (
                <div className="flex items-center gap-2 mb-2 mt-2 text-gray-300 font-extrabold">
                  <FaShieldAlt className="text-red-600 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                  <span>
                    Warranty:{" "}
                    {product.warrenty && product.warrenty > 0
                      ? `${product.warrenty} Days`
                      : "No Warranty"}
                  </span>
                </div>
              )}
              </div> */}
              
              <div className="flex items-center gap-2 mt-3 mb-4 font-extrabold">
                <div className="flex text-red-400 animate-bounce shadow-[0_0_15px_rgba(248,113,113,0.8)]">
                  {[1, 2, 3, 4, 5].map((i) =>
                    i <= Math.round(Number(avgRating)) ? (
                      <FaStar key={i} />
                    ) : (
                      <FaRegStar key={i} />
                    ),
                  )}
                </div>
                <span className="text-gray-400 text-sm">
                  ({avgRating}/{totalReviews}) Reviews
                </span>
              </div>

              <motion.button
                onClick={handleAddtoCart}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.9 }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 
                hover:from-purple-600 hover:to-pink-700 text-white py-2 rounded-md flex 
                items-center justify-center gap-2 shadow-[0_0_5px_rgba(150,84,247,0.8)] 
                hover:shadow-[0_0_10px_rgba(150,84,247,1)] transition-all duration-300"
              >
                <HiBolt className="animate-pulse" />
                Add Tutor
              </motion.button>
            </div>
          )}
        </div>
       
       
        {/*
        {product?.isWearable === true && (
  <>
    <style jsx>{`
      @keyframes purpleGlow {
        0%,
        100% {
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
          border-color: rgba(168, 85, 247, 0.3);
        }
        50% {
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.8);
          border-color: rgba(192, 38, 211, 0.6);
        }
      }

      @keyframes textShimmer {
        0% {
          background-position: 0% 50%;
        }
        100% {
          background-position: 200% 50%;
        }
      }

      .animate-purple-ring {
        animation: purpleGlow 3s ease-in-out infinite;
      }

      .animate-shimmer-text {
        background: linear-gradient(90deg, #a855f7, #f0abfc, #a855f7);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: textShimmer 4s linear infinite;
      }
    `}</style>

    <div className="mt-10 bg-[#0f0715] border border-purple-500/30 mb-6 rounded-2xl p-6 animate-purple-ring">
      {product.isWearable && (
        <div className="mb-5">
          <p className="font-black text-[20px] mb-6 uppercase tracking-[0.2em] text-sm animate-shimmer-text">
            Available Sizes
          </p>

          <div className="flex flex-wrap gap-4">
            {product.sizes?.map((s) => (
              <div key={s} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-500"></div>

                <button className="relative px-5 py-2.5 bg-[#1a0b2e] border border-purple-500/40 rounded-lg text-purple-100 font-bold hover:scale-110 hover:border-fuchsia-400 transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                  {s}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </>
)}
*/}

        <div className="space-y-3 mb-2 mt-5">
          <div className="flex items-center gap-2 mb-4 mt-2 text-2xl text-cyan-600 font-extrabold">
            <FaInfoCircle className="text-green-500 animate-bounce shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
            <span>Description</span>
          </div>

          <div className="w-full">
            <p className="mb-4 text-gray-300 font-extrabold break-words whitespace-normal w-full">
              {product?.description}
            </p>
          </div>

          {product?.detailsPoints &&
            Array.isArray(product.detailsPoints) &&
            product.detailsPoints.length > 0 && (
              <div className="mb-6 mt-2 flex flex-wrap items-center gap-x-1 gap-y-2">
                {/* Label Section */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="animate-pulse text-[#00d4ff] text-xl">
                    <FaRocket />
                  </span>
                  <h3 className="font-semibold p-0 text-white whitespace-nowrap">
                    Highlights:
                  </h3>
                </div>

                {/* Horizontal Items Section */}
                <ul className="flex flex-wrap items-center gap-x-2 gap-y-2   list-none">
                  {product.detailsPoints.map((p, i) => (
                    <li
                      key={i}
                      /* Removed gap-1 entirely to pull text right against the icon */
                      className="flex items-center text-gray-300"
                    >
                      {/* Animated Icon Container */}
                      <span
                        /* Removed min-w-min and added pr-1 for a tiny, controlled 4px space */
                        className="inline-block animate-bounce text-blue-400 text-[23px] font-bold "
                        style={{
                          animationDelay: `${i * 0.2}s`,
                          animationDuration: "2s",
                        }}
                      >
                        {i === 0
                          ? "✓"
                          : i === 1
                            ? "★"
                            : i === 2
                              ? "⚡"
                              : i === 3
                                ? "🔒"
                                : "✨"}
                      </span>

                      {/* Static Text */}
                      <div className="w-full px-4">
                        <div className="w-full max-w-full overflow-hidden">
                          <p
                            className="
                              w-full
                              mb-4
                              text-gray-300
                              font-extrabold
                              text-sm sm:text-base md:text-lg
                              leading-relaxed
                              break-all
                              whitespace-normal"
                          >
                            {p}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

            {/*
{Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
  <div className="mt-7 mb-1">
    <div className="relative mb-8 group">
      <h3 className="text-2xl font-black uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-400 to-white bg-[length:200%_auto] animate-shimmer-text">
        Related Products
      </h3>

      <div className="absolute -bottom-2 left-0 h-[2px] w-24 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full transition-all duration-500 group-hover:w-48 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.8)]"></div>

      <div className="absolute top-0 left-0 -z-10 blur-2xl opacity-20 bg-purple-500 w-full h-full group-hover:opacity-40 transition-opacity duration-700"></div>

      <style jsx>{`
        @keyframes textShimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }

        .animate-shimmer-text {
          animation: textShimmer 5s linear infinite;
        }
      `}</style>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5">
      {relatedProducts.slice(0, 8).map((rp) => (
        <ProductCard key={rp._id?.toString()} product={rp} />
      ))}
    </div>
  </div>
)}
*/}

        {/* review sections */}

        <motion.div
          // MAIN LOGIC: Your specific purple shadow and spring physics
          className="mt-9 bg-[#05070a] rounded-lg p-8 border border-gray-800 transition-all duration-500 cursor-pointer group"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{
            y: -10,
            boxShadow: "0px 0px 40px rgba(168, 85, 247, 0.6)",
            borderColor: "rgba(168, 85, 247, 0.5)",
          }}
          transition={{ type: "spring", damping: 18, stiffness: 70 }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Star className="text-purple-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
              Custom Reviews
            </h2>
          </div>

          <div className="mb-8">
            {/* Rating Section */}
            <div className="flex items-center gap-2 mb-3">
              <p className="text-white font-semibold">Add Your Rating</p>
            </div>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.span
                  key={i}
                  onClick={() => setReviewRating(i)}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer text-2xl"
                >
                  {i <= reviewRating ? (
                    <FaStar className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                  ) : (
                    <FaRegStar className="text-gray-600 hover:text-gray-400" />
                  )}
                </motion.span>
              ))}
            </div>

            {/* Textarea Field with Icon */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 text-white/70">
                <MessageSquareText size={18} className="text-purple-400" />
                <label className="font-medium">Your Thoughts</label>
              </div>
              <textarea
                className="w-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-lg p-4 bg-black/50 text-white border border-white/10 transition-all placeholder:text-gray-600"
                rows={3}
                placeholder="What did you think about the experience?..."
                onChange={(e) => setReviewComment(e.target.value)}
                value={reviewComment}
              ></textarea>
            </div>

            {/* Image Upload Field with Icon */}
            <div className="flex flex-col mb-6">
              <div className="flex items-center gap-2 mb-3 text-white/70">
                <ImageIcon size={18} className="text-purple-400" />
                <label className="font-medium" htmlFor="img">
                  Post a Photo
                </label>
              </div>

              <div className="relative group/input w-fit">
                <input
                  accept="image/*"
                  className="hidden"
                  type="file"
                  id="img"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                      setReviewImage(file);
                    }
                  }}
                />
                <label
                  htmlFor="img"
                  className="flex items-center gap-3 px-6 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 hover:border-purple-500/50 cursor-pointer transition-all"
                >
                  <UploadCloud size={20} />
                  <span>Choose Image</span>
                </label>
              </div>

              <AnimatePresence>
                {preview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="mt-4 relative w-[120px] h-[120px] rounded-xl overflow-hidden border-2 border-purple-500/40 shadow-2xl"
                  >
                    <Image
                      src={preview}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Button */}
            <motion.button
              onClick={handleSubmitReview}
              disabled={loading}
              whileHover={{
                scale: 1.05,
                backgroundColor: "#7e22ce",
                boxShadow: "0px 0px 20px rgba(168, 85, 247, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-purple-600 px-8 py-3 rounded-lg text-white font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <ClipLoader color="white" size={20} />
              ) : (
                <>
                  <span>Submit Review</span>
                  <Send size={18} />
                </>
              )}
            </motion.button>
          </div>

          {/* user review card */}

          {product?.reviews && product.reviews.length > 0 ? (
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="text-purple-500" size={24} />
              <h2 className="text-white font-bold text-2xl">All Reviews</h2>
            </div>
          ) : (
            <h2 className="text-white font-semibold mb-2 text-2xl opacity-50">
              No Reviews Found
            </h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
            {product?.reviews &&
              product.reviews.length > 0 &&
              product?.reviews?.map((r, i) => (
                <motion.div
                  key={i}
                  // LOGIC: Matching the purple glow and lift effect from your form
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{
                    y: -8,
                    boxShadow: "0px 0px 30px rgba(168, 85, 247, 0.4)",
                    borderColor: "rgba(168, 85, 247, 0.5)",
                  }}
                  transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5 flex flex-col h-full transition-colors duration-300"
                >
                  {/* User Header Section */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/30 bg-gray-900 flex items-center justify-center">
                      {r.user?.image ? (
                        <Image
                          src={r.user?.image}
                          alt={r.user?.name || "User"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-gray-600 w-full h-full p-1" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm tracking-wide">
                        {r.user?.name || "Anonymous"}
                      </p>
                      <div className="flex text-yellow-400 text-xs mt-1">
                        {[1, 2, 3, 4, 5].map((star) =>
                          star <= r.rating ? (
                            <FaStar
                              key={star}
                              className="drop-shadow-[0_0_5px_rgba(250,204,21,0.4)]"
                            />
                          ) : (
                            <FaRegStar key={star} className="text-gray-600" />
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Comment Section with Icon */}
                  <div className="flex-grow">
                    <div className="flex gap-2 text-gray-400 mb-4">
                      <MessageSquare
                        size={14}
                        className="mt-1 flex-shrink-0 text-purple-400"
                      />
                      <p className="text-sm leading-relaxed italic">
                        "{r.comment}"
                      </p>
                    </div>
                  </div>

                  {/* Review Image Logic */}
                  <div className="mt-auto">
                    {r.images ? (
                      <div className="group/img relative w-full h-40 border border-white/5 rounded-xl overflow-hidden bg-black">
                        <Image
                          src={r.images}
                          alt="Review Image"
                          fill
                          className="object-cover transition-transform duration-500 group-hover/img:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-3">
                          <ImageIcon size={16} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full py-4 border border-dashed border-gray-800 rounded-xl flex items-center justify-center text-gray-600 text-xs gap-2">
                        <ImageIcon size={14} />
                        No Attachment
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ViewProduct;

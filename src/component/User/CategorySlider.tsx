"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";

function CategorySlider() {
  const [startIndex, setStartIndex] = useState(0);
  const router = useRouter();
  const categories = [
    { label: "Fashion & Lifestyle", icon: "👗" },
    { label: "Electronics & Gadgets", icon: "📱" },
    { label: "Home & Living", icon: "🏠" },
    { label: "Sports & Outdoors", icon: "⚽" },
    { label: "Books & Stationery", icon: "📚" },
    { label: "Toys, kids & Baby", icon: "🧸" },
    { label: "Automotive Accessories", icon: "🚗" },
    { label: "Health & Beauty", icon: "💊" },
    { label: "Food & Groceries", icon: "🍎" },
    { label: "Gifts & Handcrafts", icon: "🎁" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 5) % categories.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 5) % categories.length);
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev - 5 + categories.length) % categories.length);
  };

  return (
    // UPDATED BACKGROUND: Deep Black/Blue with animated blobs
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 60 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full mx-auto p-8 text-center bg-[#000000] relative overflow-hidden"
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-950 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-950 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-950 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
       <motion.h2
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ staggerChildren: 0.05 }}
  className="relative mt-6 text-4xl font-bold mb-8 text-white inline-block"
>
  {/* The animated gradient text */}
  <motion.span
    className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
  >
    {"Shop by Categories".split("").map((char, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.03 }}
      >
        {char}
      </motion.span>
    ))}
  </motion.span>

  {/* Animated Ring Animation behind the text */}
  <motion.div
    className="absolute -inset-4 rounded-full border-2 border-blue-500/0"
    animate={{
      borderColor: ["rgba(56, 189, 248, 0)", "rgba(56, 189, 248, 0.5)", "rgba(56, 189, 248, 0)"],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
</motion.h2>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <motion.button
            onClick={prevSlide}
            className="p-2 bg-blue-950/50 border border-blue-900/50 rounded-full text-white hover:bg-blue-900/50 transition"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(30, 58, 138, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            ‹
          </motion.button>
          <motion.button
            onClick={nextSlide}
            className="p-2 bg-blue-950/50 border border-blue-900/50 rounded-full text-white hover:bg-blue-900/50 transition"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(30, 58, 138, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            ›
          </motion.button>
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={startIndex}
              initial={{ opacity: 0, x: 120 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -120 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {categories.slice(startIndex, startIndex + 5).map((item, index) => (
                <motion.div
                  key={startIndex + index}
                  onClick={() =>
                    router.push(
                      `/category?category=${encodeURIComponent(item.label)}&selectedCategory=${encodeURIComponent(item.label)}`,
                    )
                  }
                  // UPDATED CARD STYLE: Black background with blue accents
                  className="bg-black/40 backdrop-blur-sm border border-blue-950 p-6 rounded-xl cursor-pointer text-white"
                  whileHover={{
                    scale: 0.95,
                    y: -5,
                    borderColor: "rgba(56, 189, 248, 0.6)",
                    boxShadow: "0 10px 25px rgba(56, 189, 248, 0.2)",
                  }}
                  initial={{ opacity: 0, y: 20, rotateX: 90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <motion.span
                    className="text-4xl mb-2 block"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "tween", duration: 0.3 }}
                  >
                    {item.icon}
                  </motion.span>
                  <motion.p
                    className="text-sm font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    {item.label}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default CategorySlider;
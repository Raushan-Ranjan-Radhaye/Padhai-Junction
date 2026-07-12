"use client";

import ProductCard from "@/component/ProductCard";
import type { RootState } from "@/redux/store";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaStore, 
  FaTimes,
  FaFilter,
  FaTh,
  FaList,
  FaBoxOpen,
  FaSpinner
} from "react-icons/fa";
import { 
  GiClothes, 
  GiSmartphone, 
  GiHouse, 
  GiLipstick,
  GiBookshelf,
  GiCarWheel,
  GiHealthPotion,
  GiPencilBrush,
  GiWatch,
  GiHandSaw,
} from "react-icons/gi";
import { IProduct } from "@/model/product.model";
import { IUser } from "@/model/user.model";

// --- ANIMATION CONFIGURATION ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const hoverEffect = {
  y: -5,
  boxShadow: "0px 0px 25px rgba(56, 189, 248, 0.3)", // Light blue shadow
  borderColor: "rgba(56, 189, 248, 0.4)",
  transition: { type: "spring" as const, stiffness: 300, damping: 20 }
};

// --- COMPONENT ---
type Category = {
  label: string;
  icon: React.ReactNode;
  value: string;
};

export default function CategoriesPage() {
  const categoryList: Category[] = [
    { label: "All", icon: <FaTh />, value: "all" },
    { label: "Fashion & Lifestyle", icon: <GiClothes />, value: "Fashion & Lifestyle" },
    { label: "Electronics & Gadgets", icon: <GiSmartphone />, value: "Electronics & Gadgets" },
    { label: "Home & Living", icon: <GiHouse />, value: "Home & Living" },
    { label: "Sports & Outdoors", icon: <span>⚽</span>, value: "Sports & Fitness" },
    { label: "Books & Stationery", icon: <GiBookshelf />, value: "Books & Media" },
    { label: "Toys, kids & Baby", icon: <span>🧸</span>, value: "Toys & Games" },
    { label: "Automotive & Accessories", icon: <GiCarWheel />, value: "Automotive Accessories" },
    { label: "Health & Beauty", icon: <GiHealthPotion />, value: "Health & Wellness" },
    { label: "Food & Groceries", icon: <span>🍎</span>, value: "Food & Grocery" },
    { label: "Gifts & Handcrafts", icon: <GiHandSaw />, value: "Gifts & Handcrafts" },
  ];

  const { allVendorsData } = useSelector((state: RootState) => state.vendor);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedShop, setSelectedShop] = useState("all");
  const [search, setSearch] = useState("");
  const [shopSearch, setShopSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [displayProducts, setDisplayProducts] = useState<IProduct[]>([]);

  // Filter shops based on search
  const filterShops = !shopSearch
    ? []
    : allVendorsData.filter((vendor: IUser) =>
        vendor.shopName?.toLowerCase().includes(shopSearch.toLowerCase())
      );

  // Fetch products from API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("query", search);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedShop !== "all") params.append("shop", selectedShop);
      
      const result = await axios.get(`/api/search?${params.toString()}`);
      
      // Handle the API response structure
      if (result.data.success) {
        setDisplayProducts(result.data.products || []);
      } else {
        setDisplayProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setDisplayProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedShop]);

  // Handle category selection
  const handleCategoryClick = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setSelectedShop("all");
    setShopSearch("");
  };

  // Initialize selected category from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCategory = urlParams.get('category') || urlParams.get('selectedCategory');
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, []);

  // Handle shop selection
  const handleShopSelect = (shopName: string | undefined, shopId: string | undefined) => {
    if (shopName && shopId) {
      setShopSearch(shopName);
      setSelectedShop(shopId);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedShop("all");
    setShopSearch("");
  };

  return (
    // UPDATED BACKGROUND: Animated Deep Black/Blue Theme
    <div className="min-h-screen bg-[#000000] text-white relative overflow-hidden">
      {/* Animated Background Accent */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-950 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-950 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-950 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-black via-blue-950/40 to-black py-8 px-4 border-b border-blue-900/30">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Browse Products
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-base">
              Discover amazing products from verified shops
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search Products */}
              <motion.div 
                whileHover={hoverEffect}
                className="bg-black/60 backdrop-blur-sm rounded-2xl p-4 border border-blue-950/50"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-sky-300">
                  <FaSearch className="text-blue-400" />
                  Search
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-blue-950 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-white placeholder-gray-500"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Categories */}
              <motion.div 
                whileHover={hoverEffect}
                className="bg-black/60 backdrop-blur-sm rounded-2xl p-4 border border-blue-950/50"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-sky-300">
                  <FaFilter className="text-blue-400" />
                  Categories
                </h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-950 scrollbar-track-transparent">
                  {categoryList.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategoryClick(cat.value)}
                      className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                        selectedCategory === cat.value
                          ? "bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg shadow-blue-950/50"
                          : "bg-black text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-sm font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Search Shop */}
              <motion.div 
                whileHover={hoverEffect}
                className="bg-black/60 backdrop-blur-sm rounded-2xl p-4 border border-blue-950/50"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-sky-300">
                  <FaStore className="text-blue-400" />
                  Filter by Shop
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search shops..."
                    className="w-full px-4 py-3 rounded-xl bg-black border border-blue-950 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-white placeholder-gray-500"
                    onChange={(e) => setShopSearch(e.target.value)}
                    value={shopSearch}
                  />
                  {shopSearch && (
                    <button
                      onClick={() => {
                        setShopSearch("");
                        setSelectedShop("all");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
                
                {/* Shop Results */}
                {shopSearch && filterShops.length > 0 && (
                  <div className="mt-3 bg-black rounded-xl max-h-48 overflow-y-auto border border-blue-950">
                    {filterShops.map((vendor: IUser) => (
                      <button
                        key={vendor._id?.toString()}
                        className="w-full px-4 py-3 text-left hover:bg-blue-950 transition-colors flex items-center gap-2 border-b border-gray-800 last:border-b-0"
                        onClick={() => handleShopSelect(vendor.shopName, vendor._id?.toString())}
                      >
                        <FaStore className="text-blue-400 text-sm" />
                        <span className="text-sm text-gray-300 truncate">
                          {vendor.shopName}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Shop Display */}
                {selectedShop !== "all" && !shopSearch && (
                  <div className="mt-3 px-4 py-2 bg-blue-950/70 rounded-xl flex items-center justify-between border border-blue-800">
                    <span className="text-sm text-blue-200">
                      Selected: {allVendorsData.find((v: IUser) => v._id?.toString() === selectedShop)?.shopName}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedShop("all");
                        setShopSearch("");
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Clear Filters Button */}
              {(search || selectedCategory !== "all" || selectedShop !== "all") && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={clearFilters}
                  className="w-full py-3 px-4 bg-red-950/50 hover:bg-red-950 text-red-300 rounded-xl transition-all flex items-center justify-center gap-2 border border-red-900"
                >
                  <FaTimes />
                  Clear All Filters
                </motion.button>
              )}
            </div>

            {/* Main Content - Products Grid */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6 bg-black/60 p-4 rounded-xl border border-blue-950/50">
                <div className="text-gray-300 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin text-blue-400" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <FaBoxOpen className="text-blue-400" />
                      <span>
                        {displayProducts.length} {displayProducts.length === 1 ? "product" : "products"} found
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid" 
                        ? "bg-blue-700 text-white" 
                        : "bg-black text-gray-400 hover:text-white"
                    }`}
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list" 
                        ? "bg-blue-700 text-white" 
                        : "bg-black text-gray-400 hover:text-white"
                    }`}
                  >
                    <FaList />
                  </button>
                </div>
              </div>

              {/* Products Display */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20"
                  >
                    <FaSpinner className="animate-spin text-5xl text-blue-500 mb-4" />
                    <p className="text-gray-400">Loading products...</p>
                  </motion.div>
                ) : displayProducts.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-20 bg-black/40 rounded-2xl border border-blue-950/50"
                  >
                    <FaBoxOpen className="text-6xl text-gray-800 mb-4 mx-auto" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Products Found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="products"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={`grid gap-5 ${
                      viewMode === "grid" 
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                        : "grid-cols-1"
                    }`}
                  >
                    {displayProducts.map((product: IProduct) => (
                      <motion.div key={product._id?.toString()} variants={itemVariants}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
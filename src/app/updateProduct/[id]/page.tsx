"use client";

import axios from "axios";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { RootState } from "@/redux/store";

function UpdateProduct() {
  const categories = [
    "All Boards",
    "CBSE Board",
    "BIHAR Board",
    "ICSE Board",
    "Nursery to 10 Class",
    "All Subjects",
    "Social Science",
    "Math & Science",
    "Computer Science",
    "Sanskrit,Hindi & English",
    "Others",
  ];

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  const params = useParams();
  const productId = params.id as string;

  const { allProductsData } = useSelector((state: RootState) => state.vendor);

  // Find product by converting both to string for comparison
  const product = allProductsData?.find((p) => {
    const productStringId = p._id?.toString();
    console.log("Comparing:", productStringId, "vs", productId);
    return productStringId === productId;
  });

  console.log(
    "All product IDs:",
    allProductsData?.map((p) => p._id?.toString()),
  );

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isWearable, setIsWearable] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);
  const [replacementDays, setReplacementDays] = useState("");
  const [warranty, setWarranty] = useState("");
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [payOnDelivery, setPayOnDelivery] = useState(false);
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);
  const [image4, setImage4] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const [preview3, setPreview3] = useState<string | null>(null);
  const [preview4, setPreview4] = useState<string | null>(null);
  const [detailPoints, setDetailPoints] = useState<string[]>([]);
  const [currentPoint, setCurrentPoint] = useState("");
  const [pointIndex, setPointIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!product || isInitialized) return;

    console.log("Initializing product data:", product);

    // Initialize all form fields with product data
    const initializeProductData = () => {
      setTitle(product.title || "");
      setDescription(product.description || "");
      setPrice(String(product.price || ""));
      setStock(String(product.stock || ""));
      setCategory(product.category || "");
      // If the product's category is not in the predefined list, set it as custom category
      if (product.category && !categories.includes(product.category)) {
        setCustomCategory(product.category);
      }

      setIsWearable(Boolean(product.isWearable));
      setSizes(product.sizes || []);
      setReplacementDays(
        product.replacementDays ? String(product.replacementDays) : "",
      );
      setWarranty(product.warrenty ? String(product.warrenty) : "");
      setFreeDelivery(Boolean(product.freeDelivery));
      setPayOnDelivery(Boolean(product.payOnDelivery));
      setDetailPoints(product.detailsPoints || []);
      setPointIndex(product.detailsPoints?.length || 0);

      // Set image previews from existing product data
      if (product.image1) setPreview1(product.image1);
      if (product.image2) setPreview2(product.image2);
      if (product.image3) setPreview3(product.image3);
      if (product.image4) setPreview4(product.image4);

      setIsInitialized(true);
    };

    // Use setTimeout to avoid synchronous state updates in effect
    const timer = setTimeout(initializeProductData, 0);
    return () => clearTimeout(timer);
  }, [product, isInitialized]);

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleAddPoint = () => {
    if (!currentPoint.trim()) return;

    setDetailPoints((prev) => [...prev, currentPoint]);
    setCurrentPoint("");
  };

  const handlerRemove = (i: number) => {
    setDetailPoints((prev) => prev.filter((_, index) => index !== i));
  };

  const handlerSubmit = async () => {
    if (!productId) {
      alert("Product ID is missing. Please try again.");
      return;
    }

    if (isWearable && sizes.length === 0) {
      alert("Please select at least one size for wearable products");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("title", title);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append(
        "category",
        category === "Others" ? customCategory : category,
      );
      formData.append("description", description);
      formData.append("isWearable", String(isWearable));
      sizes.forEach((size) => formData.append("sizes", size));
      formData.append("replacementDays", replacementDays);
      formData.append("warranty", warranty);
      formData.append("freeDelivery", String(freeDelivery));
      formData.append("payOnDelivery", String(payOnDelivery));
      detailPoints.forEach((point) => formData.append("detailsPoints", point));

      // Only append new images if they were uploaded
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const result = await axios.post(`/api/vendor/updateProduct`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Product updated successfully:", result.data);
      setLoading(false);
      alert("Product updated successfully.");
      router.push("/");
    } catch (error: unknown) {
      setLoading(false);
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { status: number; data: { message?: string } };
        };
        if (axiosError.response?.status === 403) {
          alert(
            axiosError.response.data.message ||
              "You must be a verified vendor to Update Products.",
          );
        } else if (axiosError.response?.status === 401) {
          alert("Please log in to continue.");
        } else {
          alert("Failed to Update Product. Please try again.");
        }
      } else {
        alert("Failed to Update Product. Please try again.");
      }
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 pt-20 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl border border-white/20 shadow-xl"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Update Card
        </h1>

        {/* Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Name
            </label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Product Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              type="number"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              How many children are to teach.
            </label>
            <input
              onChange={(e) => setStock(e.target.value)}
              value={stock}
              type="number"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Give the number of children"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option className="bg-gray-800" value="">
                Select Category
              </option>
              {categories.map((cat) => (
                <option
                  key={cat}
                  className="bg-gray-900 text-white"
                  value={cat}
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {category === "Others" && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Custom Category
            </label>
            <input
              onChange={(e) => setCustomCategory(e.target.value)}
              value={customCategory}
              type="text"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Custom Category"
            />
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Product Description
          </label>
          <textarea
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Product Description"
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          ></textarea>
        </div>

        {/* Product Type */}
        {/* <div className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            className="w-5 h-5"
            onChange={() => setIsWearable(!isWearable)}
            checked={isWearable}
          />
          <span className="text-sm">This is a wearable / clothing product</span>
        </div> */}

        {/* {isWearable && (
          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold">Select Sizes</p>
            <div className="flex flex-wrap gap-3">
              {sizeOptions.map((size) => (
                <button
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    sizes.includes(size)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-transparent text-white border-white/20 hover:bg-white/10"
                  }`}
                  onClick={() => toggleSize(size)}
                  type="button"
                  key={size}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )} */}

        {/* Additional Features */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Replacement Days
            </label>
            <input
              type="text"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Replacement Days"
              onChange={(e) => setReplacementDays(e.target.value)}
              value={replacementDays}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Warranty</label>
            <input
              type="text"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Warranty"
              onChange={(e) => setWarranty(e.target.value)}
              value={warranty}
            />
          </div>
        </div> */}

        {/* Delivery Options */}
        <div className="flex items-center gap-6 mb-6">
          {/* <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="w-5 h-5"
              onChange={() => setFreeDelivery(!freeDelivery)}
              checked={freeDelivery}
            />
            <span className="text-sm">Free Delivery</span>
          </div> */}
           <div className="flex items-center gap-3">
             <input
               type="checkbox"
               className="w-5 h-5"
               onChange={() => setPayOnDelivery(!payOnDelivery)}
               checked={payOnDelivery}
             />
             <span className="text-sm">Pay Online</span>
           </div>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-lg">Upload Your Image</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* image 1 */}
            <div>
              <input
                type="file"
                hidden
                id="img1"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  setImage1(file);
                  setPreview1(URL.createObjectURL(file));
                }}
              />
              <label
                htmlFor="img1"
                className="cursor-pointer bg-gray-800 p-3 rounded-lg flex items-center justify-center border border-white/20 hover:bg-gray-700 transition-colors"
              >
                {preview1 ? (
                  <img
                    src={preview1}
                    alt="img1"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 text-sm">
                    <FiUpload size={24} className="mb-2" />
                    <span>Image 1</span>
                  </div>
                )}
              </label>
            </div>

            {/* image 2 */}
            {/* <div>
              <input
                type="file"
                hidden
                id="img2"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  setImage2(file);
                  setPreview2(URL.createObjectURL(file));
                }}
              />
              <label
                htmlFor="img2"
                className="cursor-pointer bg-gray-800 p-3 rounded-lg flex items-center justify-center border border-white/20 hover:bg-gray-700 transition-colors"
              >
                {preview2 ? (
                  <img
                    src={preview2}
                    alt="img2"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 text-sm">
                    <FiUpload size={24} className="mb-2" />
                    <span>Image 2</span>
                  </div>
                )}
              </label>
            </div> */}

            {/* image 3 */}
            {/* <div>
              <input
                type="file"
                hidden
                id="img3"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  setImage3(file);
                  setPreview3(URL.createObjectURL(file));
                }}
              />
              <label
                htmlFor="img3"
                className="cursor-pointer bg-gray-800 p-3 rounded-lg flex items-center justify-center border border-white/20 hover:bg-gray-700 transition-colors"
              >
                {preview3 ? (
                  <img
                    src={preview3}
                    alt="img3"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 text-sm">
                    <FiUpload size={24} className="mb-2" />
                    <span>Image 3</span>
                  </div>
                )}
              </label>
            </div> */}

            {/* image 4 */}
            {/* <div>
              <input
                type="file"
                hidden
                id="img4"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  setImage4(file);
                  setPreview4(URL.createObjectURL(file));
                }}
              />
              <label
                htmlFor="img4"
                className="cursor-pointer bg-gray-800 p-3 rounded-lg flex items-center justify-center border border-white/20 hover:bg-gray-700 transition-colors"
              >
                {preview4 ? (
                  <img
                    src={preview4}
                    alt="img4"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 text-sm">
                    <FiUpload size={24} className="mb-2" />
                    <span>Image 4</span>
                  </div>
                )}
              </label>
            </div> */}
          </div>
        </div>

        {/* Product Details Points */}
        <div className="mb-6">
          <p className="font-semibold mb-3 text-lg">Your Important Detail Points</p>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={currentPoint}
              className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a detail point"
              onChange={(e) => setCurrentPoint(e.target.value)}
            />
            <button
              onClick={handleAddPoint}
              type="button"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Add Point
            </button>
          </div>
          {detailPoints.length > 0 && (
            <ul className="space-y-3">
              {detailPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-white/10 p-3 rounded-lg"
                >
                  <span className="text-sm">
                    {index + 1}. {point}
                  </span>
                  <button
                    onClick={() => handlerRemove(index)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    type="button"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3 text-red-400 hover:text-red-600 border border-red-400 hover:border-red-600 rounded-lg font-semibold transition-colors"
            type="button"
          >
            Cancel
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            onClick={handlerSubmit}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
          >
            {loading ? <ClipLoader size={20} color={"#fff"} /> : "Update Product"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default UpdateProduct;

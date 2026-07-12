"use client";
import { useState } from "react";
import UseGetCurrentUser from "@/hooks/UseGetCurrentUser";
import { RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserImage from "@/assets/User.png";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/userSlice";

function Profile() {
  const router = useRouter();
  UseGetCurrentUser();
  const user = useSelector((state: RootState) => state.user.userData);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditShop, setShowEditShop] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.image || UserImage);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [shopName, setShopName] = useState(user?.shopName || "");
  const [shopAddress, setShopAddress] = useState(user?.shopAddress || "");
  const [gstNumber, setGstNumber] = useState(user?.gstNumber || "");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handlePreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async (event?: React.MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData();
    
    if (!name || !phone) {
      alert("Name and phone are required");
      return;
    }

    formData.append("name", name);
    formData.append("phone", phone);

    if (profileImage) {
      formData.append("image", profileImage);
    }
    
    setLoading(true);

    try {
      const result = await axios.post("/api/user/update-profile", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      alert("Profile updated successfully");
      dispatch(setUser(result.data.user));
      setProfileImage(null);
      setShowEditProfile(false);
      // Reset preview image to the updated one
      if (result.data.user.image) {
        setPreviewImage(result.data.user.image);
      }
    } catch (error: unknown) {
      setLoading(false);
      console.error("Profile update error:", error);
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          alert(axiosError.response.data.message);
        } else {
          alert("Failed to update profile. Please try again.");
        }
      } else {
        alert("Failed to update profile. Please try again.");
      }
    }
  };




  const handlerVerifyAgain = async () => {
    if (!shopAddress || !shopName || !gstNumber) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const result = await axios.post("/api/vendor/verifyagain", {
        shopName,
        shopAddress,
        gstNumber,
      });
      setLoading(false);
      alert(
        "Verification request sent successfully! Redirecting to home page...",
      );
      router.push("/");
    } catch (error) {
      setLoading(false);
      alert("Failed to send verification request. Please try again.");
      console.log(error);
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 pt-24 pb-10">
      <motion.div
        className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-6 sm:p-10 rounded-2xl border border-white/10 shadow-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            className="w-24 h-24 sm:w-28 rounded-full overflow-hidden border hover:border-blue-400 border-white/30"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={previewImage}
              alt="profile image"
              width={120}
              height={120}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <h2 className="text-2xl font-bold mt-4">{user?.name}</h2>
          <p className="text-gray-300 text-sm sm:text-base">{user?.email}</p>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            <span className="text-blue-400 uppercase">
              Role: {""} {user?.role}
            </span>
          </p>
        </div>
        <div className="mt-5 space-y-3 text-sm sm:text-base">
          <p className="">
            <b>Phone:</b>
            {user?.phone || "-"}
          </p>

          {user?.role == "vendor" && (
            <div>
              <p className="">
                <b>Shop Name:</b>
                {user?.shopName || "-"}
              </p>
              <p>
                <b>Shop Address :</b>
                {user?.shopAddress || "-"}{" "}
              </p>
              <p>
                <b>Gst Number:</b>
                {user?.gstNumber || "-"}{" "}
              </p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 mt-8">
          {user?.role == "user" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
              onClick={() => router.push("/orders")}
            >
              My Orders
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={() => {
              setShowEditProfile(!showEditProfile);
              setShowEditShop(false);
            }}
          >
            Edit Profile
          </motion.button>
          {user?.role == "vendor" && (
            <motion.button
              onClick={() => {
                setShowEditShop(!showEditShop);
                setShowEditProfile(false);
              }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Edit Shop Details
            </motion.button>
          )}
        </div>
        <AnimatePresence>
          {showEditProfile && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="mt-10 bg-white/5 p-5 sm:p-6 rounded-xl border-white/20 "
            >
              <h3 className="text-xl font-bold mb-5 ">Edit Profile</h3>
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/30 mb-3 hover:border-blue-400 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={previewImage}
                    width={120}
                    height={120}
                    className="object-cover w-full h-full"
                    alt="Profile Image"
                  />
                </motion.div>
                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Select Image
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handlePreviewImage}
                  />
                </label>
              </div>
              <div className="space-y-4">
                <input
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                />

                <input
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  type="text"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPhone(e.target.value)
                  }
                />
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={handleUpdateProfile}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? <ClipLoader color="white" size={20} /> : "Update Profile"}
                </motion.button>
                <motion.button
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEditProfile(false)}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEditShop && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="mt-10 bg-white/5 p-5 sm:p-6 rounded-xl border-white/20 "
            >
              <h3 className="text-xl font-bold mb-5 ">Edit Shop Details</h3>
              <div className="space-y-4">
                <input
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  type="text"
                  placeholder="Shop Name"
                  value={shopName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setShopName(e.target.value)
                  }
                />

                <input
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  type="text"
                  placeholder="Shop Address"
                  value={shopAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setShopAddress(e.target.value)
                  }
                />

                <input
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  type="text"
                  placeholder="GST Number"
                  value={gstNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setGstNumber(e.target.value)
                  }
                />
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlerVerifyAgain}
                  disabled={loading}
                >
                  {loading? <ClipLoader color="white" size={20} /> : "Update Shop Details"}
                </motion.button>
                <motion.button
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEditShop(false)}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Profile;

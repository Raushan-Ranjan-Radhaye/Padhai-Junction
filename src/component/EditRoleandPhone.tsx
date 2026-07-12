"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineShop, AiOutlineTool, AiOutlineUser } from "react-icons/ai";
import { MdPhone, MdErrorOutline, MdLock, MdBlock } from "react-icons/md";
import { TbPlayerTrackNext } from "react-icons/tb";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from "react-icons/fa";


function EditRoleandPhone() {
  const [phone, setPhone] = useState<string>("");
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(null);
  const [adminExist, setAdminExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const roles = [
    { labels: "Admin", value: "admin", icon: <FaUserShield size={40} /> },
    { labels: "Teacher", value: "vendor", icon: <FaChalkboardTeacher  size={40} /> },
    { labels: "Student", value: "user", icon: <FaUserGraduate size={40} /> },
  ];

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get("/api/admin/check-admin");
        setAdminExist(response.data.exists);
      } catch (error) {
        setAdminExist(false);
      }
    };
    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   if (selectedRoleIndex === null) {
    setError("Please Selected the Any Role ");
    return;
  }


    if (phone.length < 10) {
      setError("Invalid  Phone Number");
      return;
    }

    if (roles[selectedRoleIndex].value === "admin" && adminExist) return;

    setLoading(true);
    setError("");

    try {
      await axios.post("/api/user/edit-role-phone", {
        role: roles[selectedRoleIndex].value,
        phone,
      });
      await axios.get("/api/auth/session");
      router.push("/");
    } catch (error) {
      setLoading(false);
      setError("Update failed. Please try again.");
    }
  };

  const isAdminSelectedAndExists =
    selectedRoleIndex !== null &&
    roles[selectedRoleIndex].value === "admin" &&
    adminExist;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0e0b09] via-[#171310] to-[#0e0b09] text-[#EDE6D3] p-6 overflow-hidden font-sans">
      {/* --- STAGE BACKGROUND: spotlight cone + curtain folds --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ opacity: [1, 0.85, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,163,61,0.22) 0%, rgba(232,163,61,0.05) 40%, transparent 68%)",
          }}
        />
        <div
          className="absolute -left-10 top-0 bottom-0 w-32 opacity-40 blur-[1px]"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(122,46,46,0.35) 0px, rgba(122,46,46,0.12) 14px, rgba(122,46,46,0.35) 28px)",
          }}
        />
        <div
          className="absolute -right-10 top-0 bottom-0 w-32 opacity-40 blur-[1px]"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(122,46,46,0.35) 0px, rgba(122,46,46,0.12) 14px, rgba(122,46,46,0.35) 28px)",
          }}
        />
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-lg bg-[#EDE6D3]/[0.04] backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-[#E8A33D]/15"
        >
          {/* Slate strip */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EDE6D3]/10 font-mono text-[10px] tracking-[0.15em] uppercase text-[#a89f8f]">
            <span>Casting Call</span>
            <span>Assign Role</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#E8A33D] to-[#c97b2e] bg-clip-text text-transparent">
              Setup Your Profile
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E8A33D]/50 group-focus-within:text-[#E8A33D] transition-colors" />
              <input
                placeholder="Mobile Number"
                maxLength={10}
                required
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                className="w-full bg-[#EDE6D3]/[0.04] border border-[#EDE6D3]/10 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#E8A33D] transition-all text-[#EDE6D3] placeholder:text-[#7a7266]"
              />
            </div>

            {error && (
              <p className="text-[#e2a3a3] text-sm mt-2 ml-1">{error}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {roles.map((rol, index) => {
                const isAdminBlocked = rol.value === "admin" && adminExist;
                const isSelected = selectedRoleIndex === index;

                return (
                  <motion.div
                    key={rol.value}
                    onClick={() => setSelectedRoleIndex(index)}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: isAdminBlocked
                        ? "0px 0px 20px 2px rgba(122, 46, 46, 0.4)"
                        : "0px 0px 20px 2px rgba(232, 163, 61, 0.4)",
                    }}
                    className={`relative p-4 text-center rounded-2xl border transition-all duration-300 cursor-pointer
                      ${
                        isSelected && !isAdminBlocked
                          ? "border-[#E8A33D] bg-[#E8A33D]/15 shadow-[#E8A33D]/20"
                          : "border-[#EDE6D3]/10 bg-[#EDE6D3]/[0.04]"
                      }
                      ${
                        isSelected && isAdminBlocked
                          ? "border-[#7a2e2e] bg-[#7a2e2e]/10 shadow-[#7a2e2e]/20"
                          : ""
                      }
                      ${isAdminBlocked && !isSelected ? "opacity-40 grayscale" : ""}
                    `}
                  >
                    <div
                      className={`mb-2 flex justify-center ${
                        isSelected
                          ? isAdminBlocked
                            ? "text-[#c97a7a]"
                            : "text-[#E8A33D]"
                          : "text-[#8f887a]"
                      }`}
                    >
                      {isAdminBlocked ? <MdLock size={40} /> : rol.icon}
                    </div>
                    <span className="font-bold text-sm">{rol.labels}</span>

                    {isAdminBlocked && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-x-0 bottom-2"
                      >
                        <span className="text-[10px] text-[#E8A33D] font-extrabold uppercase tracking-widest drop-shadow-[0_0_8px_rgba(232,163,61,0.8)]">
                          Occupied
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              type="submit"
              disabled={loading || isAdminSelectedAndExists}
              animate={
                isAdminSelectedAndExists
                  ? {
                      backgroundColor: "#3a1414",
                      boxShadow: "0px 0px 15px rgba(122, 46, 46, 0.5)",
                    }
                  : loading
                  ? {
                      backgroundColor: ["#E8A33D", "#c97b2e", "#E8A33D"],
                      boxShadow: "0px 0px 30px rgba(232, 163, 61, 0.6)",
                    }
                  : { backgroundColor: "#E8A33D" }
              }
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-full py-4 flex items-center justify-center gap-2 rounded-xl font-black transition-all shadow-lg text-[#171310]"
            >
              {isAdminSelectedAndExists ? (
                <motion.div
                  initial={{ x: -5 }}
                  animate={{ x: 5 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 0.1,
                  }}
                  className="flex items-center gap-2 text-[#e2a3a3]"
                >
                  <MdBlock size={22} />
                  <span className="tracking-tighter uppercase">
                    Admin Already Exists
                  </span>
                </motion.div>
              ) : loading ? (
                <div className="flex items-center gap-3">
                  <ClipLoader size={20} color="#171310" />
                  <span className="tracking-widest">PROCESSING...</span>
                </div>
              ) : (
                <>
                  Complete Setup <TbPlayerTrackNext size={20} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default EditRoleandPhone;
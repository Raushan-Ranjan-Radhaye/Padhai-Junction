"use client";

import { IUser } from "../model/user.model";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Footer({ user }: { user: IUser }) {
  const role = user?.role;
  const isUser = role === "user";
  const isAdminOrVendor = role === "admin" || role === "vendor";
  const router = useRouter();

  // STARDUST particles removed to fix performance lag
  return (
    <div className="relative  bg-[#000000] w-full text-gray-300 z-40 py-12 border-t border-blue-900/50 overflow-hidden transition-all duration-700 hover:shadow-[0_0_100px_rgba(59,130,246,0.3)] group/main">
      
      {/* --- 1. RADIATING GING RIPPLES --- */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="w-[30%] h-[30%] rounded-full border border-blue-500/15 animate-ging-ripple" />
        <div className="absolute w-[60%] h-[60%] rounded-full border border-blue-400/10 animate-ging-ripple [animation-delay:1.5s]" />
        <div className="absolute w-[90%] h-[90%] rounded-full border border-blue-300/5 animate-ging-ripple [animation-delay:3s]" />
      </div>

      {/* --- 2. CONIC SPINNING RING (Hover Effect) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover/main:opacity-100 transition-opacity duration-1000">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,#3b82f6_360deg)] animate-spin-fast"
        />
      </div>
      <div className="absolute inset-[2px] bg-black z-0" />

      {/* --- GRID & RESPONSIVE BREAKPOINTS (STRICTLY UNCHANGED) --- */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-6 grid gap-10 text-center md:text-left ${isUser ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-3"}`}
      >
        <div className="space-y-3">
          <h2
            onClick={() => router.push("/")}
            className="text-white text-3xl font-bold cursor-pointer tracking-wide hover:text-blue-400 transition hover:drop-shadow-[0_0_15px_#3b82f6]"
          >
            Padhai Junction
          </h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Smart, secure & scalable Padhai Junction platform built for
            Teaching and growth.
          </p>
          {isAdminOrVendor && (
            <span
              className={`inline-block mt-2 text-[11px] px-4 py-1.5 rounded-full text-white font-bold animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)] ${
                role === "admin" ? "bg-blue-600" : "bg-blue-800"
              }`}
            >
              {role === "admin" ? "Admin Access" : "Vendor Access"}
            </span>
          )}
        </div>

        {isUser && (
          <div className="">
            <h3 className="text-white text-lg font-semibold mb-4 border-b border-blue-900/40 pb-1 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li onClick={() => router.push("/")} className="cursor-pointer hover:text-blue-400 hover:translate-x-2 transition-all">Home</li>
              {/* <li onClick={() => router.push("/category")} className="cursor-pointer hover:text-blue-400 hover:translate-x-2 transition-all">Categories</li> */}
              {/* <li onClick={() => router.push("/shop")} className="cursor-pointer hover:text-blue-400 hover:translate-x-2 transition-all">Shop</li> */}
              <li onClick={() => router.push("/orders")} className="cursor-pointer hover:text-blue-400 hover:translate-x-2 transition-all">Orders</li>
            </ul>
          </div>
        )}

        {isUser && (
          <div className="">
            <h3 className="text-white text-lg font-semibold mb-4 border-b border-blue-900/40 pb-1 inline-block">
              Help & Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li onClick={() => router.push("/support")} className="cursor-pointer hover:text-blue-400 hover:translate-x-2 transition-all">Support</li>
              <li onClick={() => router.push("/orders")} className="cursor-pointer hover:text-blue-400 hover:translate-x-2 transition-all">Track Orders</li>
            </ul>
          </div>
        )}

        {isAdminOrVendor && (
          <div className="bg-[#080808] rounded-2xl p-6 shadow-2xl border border-blue-900/40 group-hover/main:border-blue-500/70 transition-all duration-500">
            <h2 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
              {role === "admin" ? "System Core" : "Store Manager"}
            </h2>
            <ul className="space-y-2 text-sm text-gray-400">
              {role === "admin" ? (
                <React.Fragment>
                  <li className="hover:text-blue-300">✔️ Platform Management</li>
                  <li className="hover:text-blue-300">✔️ Vendor Control</li>
                  <li className="hover:text-blue-300">✔️ Orders & Revenue</li>
                  <li className="hover:text-blue-300">✔️ System Security</li>
                </React.Fragment>
              ) : (
                <div className="">
                  <li className="hover:text-blue-300">✔️ Product Upload & Edit</li>
                  <li className="hover:text-blue-300">✔️ Order & Delivery</li>
                  <li className="hover:text-blue-300">✔️ Sales & Profit</li>
                  <li className="hover:text-blue-300">✔️ Wallet Settlement</li>
                </div>
              )}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <h2 className="text-white text-lg font-semibold mb-4 border-b border-blue-900/40 pb-1 inline-block">
            Contact Info
          </h2>
          <p className="text-sm hover:text-blue-400 transition-colors cursor-pointer">ayamankumar@gmail.com</p>
          <p className="text-sm hover:text-blue-400 transition-colors cursor-pointer">+91 9576901286</p>
          <p className="text-sm text-gray-500">Patna, Bihar</p>
        </div>
      </div>

      <div className="relative z-10 text-center text-[10px] tracking-[0.4em] text-gray-600 mt-12 border-t border-blue-900/20 pt-8 uppercase font-bold">
         © {new Date().getFullYear()} Padhai Junction 
      </div>

      <style jsx global>{`
        @keyframes ging-ripple {
          0% { transform: scale(0.8); opacity: 0; }
          50% { opacity: 0.15; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes spin-fast {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-ging-ripple { animation: ging-ripple 6s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-spin-fast { animation: spin-fast 6s linear infinite; }
      `}</style>
    </div>
  );
}

export default Footer;
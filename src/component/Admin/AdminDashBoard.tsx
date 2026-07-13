"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaBox, FaCheckCircle, FaShoppingBag, FaStore } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import VendorDetail from "./VendorDetail";
import UserOrders from "./UserOrders";
import VendorApprovel from "./VendorApprovel";
import ProductApprovel from "./ProductApprovel";
import Dashboard from "./Dashboard";

function AdminDashBoard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [openMenu, setOpenMenu] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "vendors":
        return <VendorDetail />;
      case "orders":
        return <UserOrders />;
      case "product-approval":
        return <ProductApprovel />;
      case "vendor-approval":
        return <VendorApprovel />;
    }
  };

  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <MdDashboard size={22} /> },
    { id: "vendors", label: "Teacher Details", icon: <FaStore size={22} /> },
    { id: "orders", label: "Student Orders", icon: <FaShoppingBag size={22} /> },
    {
      id: "vendor-approval",
      label: "Teacher Approval",
      icon: <FaCheckCircle size={22} />,
    },
    {
      id: "product-approval",
      label: "Product Approval",
      icon: <FaBox size={22} />,
    },
  ];

  return (
    <div className="w-full min-h-screen flex items-start justify-start bg-gradient-to-br mt-14 from-gray-900 via-black to-gray-900 text-white">
      {/* Mobile Tab View */}
      <div className="lg:hidden fixed top-15 left-0 w-full bg-black px-6 py-3 flex  justify-between items-center border-b border-gray-700 z-50">
        <h1 className="text-xl font-bold ">Admin Panel</h1>
        {!openMenu && (
          <button className="" onClick={() => setOpenMenu(true)}>
            <AiOutlineMenu size={25} className="cursor-pointer" />
          </button>
        )}
      </div>

      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="hidden lg:block w-72 min-h-screen bg-gray-800/40 border-r border-gray-700 p-6 backdrop-blur-xl"
      >
        <h1 className="text-xl font-bold mb-8 ">Admin Panel</h1>
        <div className="flex flex-col gap-6">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/10 text-left
                 ${activePage === item.id ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-200"}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* side bar for mobile */}

      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 w-72 h-full bg-gray-800/90 backdrop-blur-xl p-6 z-50 border-r border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <button onClick={() => setOpenMenu(false)}>
                <AiOutlineClose size={26} className="cursor-pointer" />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {menu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setOpenMenu(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/10 text-left
                     ${activePage === item.id ? "bg-blue-600 text-white" : "bg-black/20 hover:bg-gray-700 text-gray-200"}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* main area */}

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        exit={{ opacity: 0 }}
        className="flex-1 p-10 mt-16 lg:mt-0 "
      >
        {renderPage()}
      </motion.div>
    </div>
  );
}

export default AdminDashBoard;

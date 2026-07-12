"use client";
import UseGetAllOrdersData from "@/hooks/UseGetAllOrdersData";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import UseGetAllProducts from "@/hooks/UseGetAllProductsData";
import UseGetAllVendors from "@/hooks/UseGetAllVendors";
import { IUser } from "@/model/user.model";
import { IProduct } from "@/model/product.model";
import { FaRupeeSign } from "react-icons/fa";
import { 
  LuPackage2, 
  LuBaggageClaim, 
  LuCircleCheck, 
  LuCircleX, 
  LuRotateCcw, 

  LuUsers,
  LuClock,
  LuCircleAlert
} from "react-icons/lu";
import {Legend, Bar, BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

// Types from Redux slices
interface PopulatedProduct {
  _id: string;
  title: string;
  image1: string;
  price: number;
  category: string;
  stock: number;
  vendor: string;
  replacementDays: number;
}

interface PopulatedVendor {
  _id: string;
  name: string;
  shopName: string;
  email: string;
}

interface IOrderData {
  _id: string;
  products: {
    product: PopulatedProduct;
    quantity: number;
    price: number;
  }[];
  buyer: string | { _id: string };
  productVendor: PopulatedVendor;
  productsTotal: number;
  deliveryCharge: number;
  serviceCharge: number;
  totalAmount: number;
  paymentMethod: "cod" | "stripe";
  isPaid: boolean;
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "returned" | "cancelled";
  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  createdAt: string;
  updatedAt: string;
}

function Dashboard() {
  UseGetAllOrdersData();
  UseGetAllProducts();
  UseGetAllVendors();

  const { allVendorsData, allProductsData } = useSelector(
    (state: RootState) => state.vendor
  );
  const { allOrdersData } = useSelector((state: RootState) => state.user);

  const vendors = allVendorsData || [];
  const pendingVendors = vendors.filter(
    (v: IUser) => v.verificationStatus === "pending"
  );
  const products = allProductsData || [];
  const pendingProducts = products.filter((p: IProduct) => p.veificationStatus === "pending");
  const orders = allOrdersData || [];
  const deliveredOrders = orders.filter((o: IOrderData) => o.orderStatus === "delivered");

  let totalEarning = 0;
  deliveredOrders.forEach((o: IOrderData) => {
    if (o.isPaid) {
      totalEarning += o.totalAmount;
    }
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"];


  // Vendor order graph data
  const vendorOrderGraph: { vendor: string; orders: number }[] = [];
  
  if (allOrdersData && allOrdersData.length > 0) {
    for (let i = 0; i < allOrdersData.length; i++) {
      const order = allOrdersData[i];
      if (!order.productVendor) continue;

      let vendorName = order.productVendor?.shopName || "Unknown";

      if (vendorName.length > 14) {
        vendorName = vendorName.slice(0, 14) + "...";
      }

      let found = false;

      for (let j = 0; j < vendorOrderGraph.length; j++) {
        if (vendorOrderGraph[j].vendor === vendorName) {
          vendorOrderGraph[j].orders = vendorOrderGraph[j].orders + 1;
          found = true;
          break;
        }
      }

      if (!found) {
        vendorOrderGraph.push({
          vendor: vendorName,
          orders: 1
        });
      }
    }
  }

  const cancelledOrders = orders.filter((o: IOrderData) => o.orderStatus === "cancelled");
  const returnedOrders = orders.filter((o: IOrderData) => o.orderStatus === "returned");
  const remainingOrders = orders.filter((o: IOrderData) => !["delivered", "cancelled", "returned"].includes(o.orderStatus));

  // Order status data for PieChart
  const orderStatusData = [
    { name: "Delivered", value: deliveredOrders.length },
    { name: "Pending", value: remainingOrders.length },
    { name: "Cancelled", value: cancelledOrders.length },
    { name: "Returned", value: returnedOrders.length },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-2 sm:p-3 md:p-4">
      <div className="max-w-full mx-auto space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          <Statbox
            title="Total Vendors"
            value={vendors.length}
            icon={<LuUsers className="h-4 w-4 sm:h-6 sm:w-6" />}
            iconColor="text-blue-400"
            iconBg="bg-blue-400/10"
          />
          <Statbox
            title="Pending Vendors"
            value={pendingVendors.length}
            icon={<LuClock className="h-4 w-4 sm:h-6 sm:w-6" />}
            iconColor="text-yellow-400"
            iconBg="bg-yellow-400/10"
          />
          <Statbox
            title="Total Products"
            value={products.length}
            icon={<LuPackage2 className="h-4 w-4 sm:h-6 sm:w-6" />}
            iconColor="text-purple-400"
            iconBg="bg-purple-400/10"
          />
          <Statbox
            title="Pending Products"
            value={pendingProducts.length}
            icon={<LuCircleAlert className="h-4 w-4 sm:h-6 sm:w-6" />}
            iconColor="text-orange-400"
            iconBg="bg-orange-400/10"
          />
          <Statbox
            title="Total Orders"
            value={orders.length}
            icon={<LuBaggageClaim className="h-4 w-4 sm:h-6 sm:w-6" />}
            iconColor="text-green-400"
            iconBg="bg-green-400/10"
          />
          <Statbox
            title="Total Earning"
            value={`₹${totalEarning.toLocaleString()}`}
            icon={<FaRupeeSign className="h-4 w-4 sm:h-6 sm:w-6" />}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-400/10"
          />
        </div>

        {/* Vendor Cards Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {vendors.map((vendor: IUser, i: number) => {
            const vendorsProducts = products.filter(
              (p: IProduct) => {
                const vendorId = p.vendor?._id?.toString() || p.vendor?.toString();
                return vendorId === vendor._id?.toString();
              }
            );

            const vendorOrders = orders.filter(
              (o: IOrderData) => o.productVendor?._id === vendor._id?.toString()
            );

            const cancelled = vendorOrders.filter(
              (o: IOrderData) => o.orderStatus === "cancelled"
            ).length;

            const returned = vendorOrders.filter(
              (o: IOrderData) => o.orderStatus === "returned"
            ).length;

            const delivered = vendorOrders.filter(
              (o: IOrderData) => o.orderStatus === "delivered"
            ).length;

            let vendorEarning = 0;
            vendorOrders.forEach((o: IOrderData) => {
              if (o.orderStatus === "delivered" && o.isPaid) {
                vendorEarning += o.totalAmount;
              }
            });

            return (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 hover:bg-white/10 transition"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h2 className="font-semibold text-xs sm:text-base md:text-lg truncate text-white">
                    {vendor.shopName}
                  </h2>
                  <span
                    className={`capitalize text-[10px] xs:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap ${
                      vendor.verificationStatus === "approved"
                        ? "bg-green-400/20 text-green-400"
                        : vendor.verificationStatus === "pending"
                        ? "bg-yellow-400/20 text-yellow-400"
                        : "bg-red-400/20 text-red-400"
                    }`}
                  >
                    {vendor.verificationStatus}
                  </span>
                </div>
                <div className="text-[10px] xs:text-sm space-y-1.5 sm:space-y-2 text-gray-300">
                  {/* Products */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <LuPackage2 className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400 flex-shrink-0" />
                      <span>Products:</span>
                    </div>
                    <span className="font-medium text-white">{vendorsProducts.length}</span>
                  </div>
                  {/* Orders */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <LuBaggageClaim className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0" />
                      <span>Orders:</span>
                    </div>
                    <span className="font-medium text-white">{vendorOrders.length}</span>
                  </div>
                  {/* Delivered */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <LuCircleCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                      <span>Delivered:</span>
                    </div>
                    <span className="font-medium text-green-400">{delivered}</span>
                  </div>
                  {/* Cancelled */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <LuCircleX className="h-3 w-3 sm:h-4 sm:w-4 text-red-400 flex-shrink-0" />
                      <span>Cancelled:</span>
                    </div>
                    <span className="font-medium text-red-400">{cancelled}</span>
                  </div>
                  {/* Returned */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <LuRotateCcw className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400 flex-shrink-0" />
                      <span>Returned:</span>
                    </div>
                    <span className="font-medium text-orange-400">{returned}</span>
                  </div>
                  {/* Earnings */}
                  <div className="border-t border-white/10 my-1.5 sm:my-2 pt-1.5 sm:pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <FaRupeeSign className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400 flex-shrink-0" />
                      <span>Earnings:</span>
                    </div>
                    <span className="font-bold text-emerald-400 text-xs sm:text-sm">
                      ₹{vendorEarning.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* BarGraph */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] hover:bg-white/10">
            <h2 className="font-semibold mb-2 text-xs sm:text-sm text-white">
              Vendor-wise Orders
            </h2>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart 
                width={500} 
                height={300} 
                data={vendorOrderGraph}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis 
                  dataKey="vendor"
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={45}
                  tick={{fontSize: 9}}
                  stroke="#9ca3af"
                />
                <YAxis tick={{fontSize: 9}} stroke="#9ca3af" width={30} />
                <Tooltip />
                <Bar dataKey="orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Order Status Distribution */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
            <h2 className="font-semibold mb-2 text-xs sm:text-sm text-white">Order Status Distribution</h2>
            {/* Status Boxes - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3 sm:mb-4">
              <StatusBox label="Delivered" value={deliveredOrders.length} icon={<LuCircleCheck className="h-4 w-4 sm:h-5 sm:w-5" />} colorClass="text-green-400" />
              <StatusBox label="Pending" value={remainingOrders.length} icon={<LuClock className="h-4 w-4 sm:h-5 sm:w-5" />} colorClass="text-yellow-400" />
              <StatusBox label="Cancelled" value={cancelledOrders.length} icon={<LuCircleX className="h-4 w-4 sm:h-5 sm:w-5" />} colorClass="text-red-400" />
              <StatusBox label="Returned" value={returnedOrders.length} icon={<LuRotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />} colorClass="text-orange-400" />
            </div>
            {/* Pie Chart */}
            <div className="h-[180px] sm:h-[200px] md:h-[220px] lg:h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={30}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

interface StatboxProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
}

function Statbox({ title, value, icon, iconColor, iconBg }: StatboxProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-2 sm:p-3 md:p-4 hover:bg-white/10 transition">
      <div className="flex items-center justify-between">
        <div className={`p-1.5 sm:p-2 rounded-lg ${iconBg || "bg-gray-400/10"}`}>
          <span className={iconColor || "text-gray-400"}>
            {icon || (
              <LuPackage2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            )}
          </span>
        </div>
      </div>
      <p className="text-[10px] xs:text-xs uppercase text-gray-400 mt-1 sm:mt-2 md:mt-3">{title}</p>
      <p className="text-sm sm:text-lg md:text-2xl font-bold text-white mt-0.5 sm:mt-1">{value}</p>
    </div>
  );
}

interface StatusBoxProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
  colorClass: string;
}

function StatusBox({ label, value, icon, colorClass }: StatusBoxProps) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-2 sm:p-3 text-center">
      <div className={`flex justify-center mb-0.5 sm:mb-1 ${colorClass}`}>
        {icon}
      </div>
      <p className="text-[10px] xs:text-xs text-gray-400">{label}</p>
      <p className={`text-sm sm:text-lg font-bold ${colorClass} mt-0.5 sm:mt-1`}>{value}</p>
    </div>
  );
}


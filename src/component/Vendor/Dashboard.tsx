"use client";
import UseGetAllOrdersData from "@/hooks/UseGetAllOrdersData";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import UseGetAllProducts from "@/hooks/UseGetAllProductsData";
import UseGetCurrentUser from "@/hooks/UseGetCurrentUser";
import { IProduct } from "@/model/product.model";
import { IUser } from "@/model/user.model";
import { FaRupeeSign } from "react-icons/fa";
import {
  LuPackage2,
  LuUsers,
  LuClock,
  LuCircleCheck,
  LuCircleX,
  LuRotateCcw,
} from "react-icons/lu";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

// Types
interface PopulatedProduct {
  _id: string;
  title: string;
  image1: string;
  price: number;
  category: string;
  stock: number;
  vendor: string | { _id: string; shopName: string; email: string };
  replacementDays: number;
}

interface IOrderData {
  _id: string;
  products: {
    product: PopulatedProduct;
    quantity: number;
    price: number;
  }[];
  buyer: string | { _id: string };
  productVendor: string | { _id: string; shopName: string; email: string };
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
  UseGetCurrentUser();

  const { allProductsData } = useSelector((state: RootState) => state.vendor);
  const { allOrdersData, userData } = useSelector((state: RootState) => state.user);

  // Filter products for this vendor
  const vendorsProducts = Array.isArray(allProductsData)
    ? allProductsData.filter((p: IProduct) => 
        String(p.vendor && typeof p.vendor === 'object' ? (p.vendor as IUser)._id : p.vendor) === String(userData?._id)
      )
    : [];

  // Filter orders for this vendor
  const vendorOrders = Array.isArray(allOrdersData)
    ? allOrdersData.filter((o: IOrderData) => 
        String(o.productVendor && typeof o.productVendor === 'object' ? (o.productVendor as unknown as { _id: string })._id : o.productVendor) === String(userData?._id)
      )
    : [];

  const validOrders = vendorOrders.filter((o: IOrderData) => 
    o.orderStatus !== "cancelled" && o.orderStatus !== "returned"
  );

  let totalSales = 0;
  const customers = new Set<string>();
  validOrders.forEach((o: IOrderData) => {
    totalSales += o.totalAmount;
    const buyerId = o.buyer && typeof o.buyer === 'object' ? o.buyer._id : o.buyer;
    customers.add(String(buyerId));
  });

  const productsSalesMap: Record<string, number> = {};
  validOrders.forEach((o: IOrderData) => {
    o.products.forEach((p) => {
      const product = p.product as unknown as PopulatedProduct;
      const t = product?.title || "Unknown";
      productsSalesMap[t] = (productsSalesMap[t] || 0) + p.quantity;
    });
  });

  const productSales = Object.keys(productsSalesMap).map((t) => ({
    product: t.length > 12 ? t.slice(0, 12) + "..." : t,
    sold: productsSalesMap[t],
  }));

  const deliveredOrders = vendorOrders.filter((o: IOrderData) => o.orderStatus === "delivered");
  const cancelledOrders = vendorOrders.filter((o: IOrderData) => o.orderStatus === "cancelled");
  const returnedOrders = vendorOrders.filter((o: IOrderData) => o.orderStatus === "returned");
  const pendingOrders = vendorOrders.filter((o: IOrderData) => 
    !["delivered", "cancelled", "returned"].includes(o.orderStatus)
  );

  const orderStatusData = [
    // { name: "Delivered", value: deliveredOrders.length },
    { name: "Pending", value: pendingOrders.length },
    // { name: "Cancelled", value: cancelledOrders.length },
    // { name: "Returned", value: returnedOrders.length },
  ];

  const ordersDateMap: Record<string, number> = {};
  validOrders.forEach((o: IOrderData) => {
    const d = new Date(o.createdAt).toLocaleDateString("en-IN", {
      month: "2-digit",
      day: "2-digit",
    });
    ordersDateMap[d] = (ordersDateMap[d] || 0) + 1;
  });

  const orderByDate = Object.keys(ordersDateMap).map((d) => ({
    date: d,
    orders: ordersDateMap[d],
  }));

  // Improved colors for dark mode
  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6366f1"];

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6 bg-[#0a0a0a]">
      <div className="max-w-7xl w-full mx-auto space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
        
        {/* Stats Grid - Fully Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <Statbox 
            title="Customers" 
            value={customers.size} 
            icon={<LuUsers />} 
            iconColor="text-purple-400" 
            iconBg="bg-purple-400/10" 
          />
          <Statbox 
            title="Products" 
            value={vendorsProducts.length} 
            icon={<LuPackage2 />} 
            iconColor="text-blue-400" 
            iconBg="bg-blue-400/10" 
          />
          <Statbox 
            title="Orders" 
            value={validOrders.length} 
            icon={<LuClock />} 
            iconColor="text-yellow-400" 
            iconBg="bg-yellow-400/10" 
          />
          <Statbox 
            title="Sales" 
            value={`₹${totalSales.toLocaleString()}`} 
            icon={<FaRupeeSign />} 
            iconColor="text-green-400" 
            iconBg="bg-green-400/10" 
          />
        </div>

        {/* Charts Section - Fully Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          
          {/* Bar Chart */}
          <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[450px]">
            <h2 className="font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4 text-white">Orders by Date</h2>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={orderByDate} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 9, fill: "#9ca3af" }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: "#9ca3af" }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} 
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="orders" fill="#8884d8" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart Section */}
          <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6">
            <h2 className="font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4 text-white">Order Status Distribution</h2>
            
            {/* Status Boxes - Fully Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 sm:mb-4 md:mb-5">
              {/* <StatusBox 
                label="Delivered" 
                value={deliveredOrders.length} 
                icon={<LuCircleCheck />} 
                colorClass="text-green-400" 
              /> */}
              <StatusBox 
                label="Pending" 
                value={pendingOrders.length} 
                icon={<LuClock />} 
                colorClass="text-yellow-400" 
              />
              {/* <StatusBox 
                label="Cancelled" 
                value={cancelledOrders.length} 
                icon={<LuCircleX />} 
                colorClass="text-red-400" 
              />
              <StatusBox 
                label="Returned" 
                value={returnedOrders.length} 
                icon={<LuRotateCcw />} 
                colorClass="text-orange-400" 
              /> */}
            </div>
            
            {/* Pie Chart - Fully Responsive */}
            <div className="h-44 sm:h-52 md:h-64 lg:h-72 xl:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    innerRadius="45%"
                    paddingAngle={5}
                    label={({ name, percent }) => percent ? `${(percent * 100).toFixed(0)}%` : `0%`}
                    labelLine={{ stroke: '#ffffff', strokeWidth: 1 }}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} 
                  />
                  <Legend 
                    wrapperStyle={{ 
                      color: "#fff", 
                      paddingTop: "10px",
                      fontSize: '11px'
                    }} 
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Product Sales Line Chart - Fully Responsive */}
        {productSales.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96">
            <h2 className="font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4 text-white">Products Sales</h2>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={productSales} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis 
                  dataKey="product" 
                  tick={{ fontSize: 9, fill: "#9ca3af" }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: "#9ca3af" }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} 
                  labelStyle={{ color: "#fff" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sold" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ fill: "#3b82f6", r: 3 }} 
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default Dashboard;

// --- Fully Responsive Statbox ---
interface StatboxProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
}

function Statbox({ title, value, icon, iconColor, iconBg }: StatboxProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 flex items-center gap-2 sm:gap-3 md:gap-4 hover:bg-white/10 transition">
      <div className={`p-2 sm:p-2.5 md:p-3 rounded-lg ${iconBg} ${iconColor} text-base sm:text-lg md:text-xl`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-xs md:text-sm uppercase text-gray-400 tracking-wider truncate">{title}</p>
        <p className="text-base sm:text-lg md:text-2xl font-bold text-white truncate">{value}</p>
      </div>
    </div>
  );
}

// --- Fully Responsive StatusBox ---
interface StatusBoxProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}

function StatusBox({ label, value, icon, colorClass }: StatusBoxProps) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-1.5 sm:p-2 md:p-2.5 text-center">
      <div className={`flex justify-center mb-0.5 sm:mb-1 ${colorClass} text-sm sm:text-base md:text-lg`}>
        {icon}
      </div>
      <p className="text-[10px] sm:text-xs text-gray-400">{label}</p>
      <p className={`text-sm sm:text-base md:text-lg font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

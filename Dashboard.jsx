import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FaShoppingCart, FaWallet, FaHome, FaUtensils, FaList, FaUsers, FaClipboardList, FaStar, FaBars, FaBook } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAdmin from "../hooks/useAdmin";
import useChef from "../hooks/useChef";
import { motion } from "framer-motion";

// ✅ FIXED IMPORT: Points directly to src/components/Navbar.jsx
import Navbar from "../components/Navbar"; 

const Dashboard = () => {
    const [isAdmin] = useAdmin();
    const [isChef] = useChef(); 
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Map routes to headings and colors
    const pageMap = {
        "/dashboard/my-profile": { title: "User Home", color: "from-purple-500 via-pink-500 to-orange-400" },
        "/dashboard/my-orders": { title: "My Orders", color: "from-yellow-400 via-orange-500 to-red-500" },
        "/dashboard/my-reviews": { title: "My Reviews", color: "from-pink-400 via-rose-500 to-red-500" },
        "/dashboard/payment-history": { title: "Payment History", color: "from-green-400 via-teal-500 to-blue-500" },
        "/dashboard/admin-home": { title: "Admin Home", color: "from-blue-500 via-indigo-500 to-purple-500" },
        "/dashboard/all-users": { title: "Manage Users", color: "from-pink-500 via-red-500 to-orange-400" },
        "/dashboard/manage-requests": { title: "Manage Requests", color: "from-red-500 via-orange-500 to-yellow-500" },
        "/dashboard/manage-items": { title: "Manage Items", color: "from-cyan-500 via-blue-500 to-indigo-500" },
        "/dashboard/admin-payment-history": { title: "Payment History", color: "from-green-400 via-teal-500 to-blue-500" },
        "/dashboard/chef-home": { title: "Chef Home", color: "from-purple-500 via-pink-500 to-orange-400" },
        "/dashboard/add-meal": { title: "Add New Meal", color: "from-yellow-400 via-orange-500 to-red-500" },
        "/dashboard/order-requests": { title: "Manage Orders", color: "from-green-400 via-teal-500 to-blue-500" },
    };

    const currentPage = pageMap[location.pathname] || { title: "Dashboard", color: "from-gray-400 via-gray-300 to-gray-200" };

    return (
        <div className="min-h-screen bg-gray-50">
            
            {/* Navbar at the top */}
            <Navbar />

            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

                {/* Main Content with padding-top (pt-28) to clear the fixed Navbar */}
                <div className="drawer-content flex flex-col bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 min-h-screen transition-all duration-500 p-6 pt-28">
                    
                    {/* Mobile Menu Button */}
                    <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden mb-4 w-fit shadow-lg">
                        <FaBars /> Open Menu
                    </label>

                    {/* Page Heading */}
                    <motion.h1
                        className={`text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${currentPage.color} mb-6 animate-gradient-x`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {currentPage.title}
                    </motion.h1>

                    {/* Page Content */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 transition-all duration-500 min-h-[500px]">
                        <Outlet />
                    </div>
                </div>

                {/* Sidebar (z-40 to stay behind Navbar's z-50) */}
                <div className="drawer-side z-40">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    
                    {/* Sidebar Links with pt-28 spacing */}
                    <ul className="menu p-6 w-80 min-h-full bg-gradient-to-b from-orange-500 via-pink-500 to-purple-600 text-white shadow-2xl rounded-tr-3xl rounded-br-3xl space-y-4 transition-all duration-500 pt-28">
                        
                        {/* Profile Section */}
                        <motion.div 
                            className="mb-6 text-center"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 animate-gradient-x">
                                FoodChef
                            </h2>
                            <p className="text-sm text-gray-100 mt-1">Dashboard</p>
                            <motion.div 
                                className="avatar mt-4 inline-block"
                                whileHover={{ scale: 1.1, rotate: 5, boxShadow: "0 0 15px rgba(255,255,255,0.5)" }}
                            >
                                <div className="w-20 h-20 rounded-full ring ring-white ring-offset-base-100 ring-offset-2 overflow-hidden">
                                    <img 
                                        src={user?.photoURL || "https://i.ibb.co/T0h0cbf/user-placeholder.png"} 
                                        alt="User" 
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </motion.div>
                            <p className="mt-2 font-bold text-white">{user?.displayName || "User"}</p>
                        </motion.div>

                        {/* Navigation Links */}
                        {isAdmin ? (
                            <>
                                <DashboardLink to="/dashboard/admin-home" icon={<FaHome />} label="Admin Home" />
                                <DashboardLink to="/dashboard/add-meal" icon={<FaUtensils />} label="Add Items" />
                                <DashboardLink to="/dashboard/manage-items" icon={<FaList />} label="Manage Items" />
                                <DashboardLink to="/dashboard/manage-requests" icon={<FaBook />} label="Manage Bookings" />
                                <DashboardLink to="/dashboard/all-users" icon={<FaUsers />} label="All Users" />
                                <DashboardLink to="/dashboard/admin-payment-history" icon={<FaWallet />} label="Payment History" />
                            </>
                        ) : isChef ? (
                            <>
                                <DashboardLink to="/dashboard/chef-home" icon={<FaHome />} label="Chef Home" />
                                <DashboardLink to="/dashboard/add-meal" icon={<FaUtensils />} label="Add Meal" />
                                <DashboardLink to="/dashboard/order-requests" icon={<FaList />} label="Order Requests" />
                            </>
                        ) : (
                            <>
                                <DashboardLink to="/dashboard/my-profile" icon={<FaHome />} label="User Home" />
                                <DashboardLink to="/dashboard/my-orders" icon={<FaShoppingCart />} label="My Orders" />
                                <DashboardLink to="/dashboard/my-reviews" icon={<FaStar />} label="My Reviews" />
                                <DashboardLink to="/dashboard/payment-history" icon={<FaWallet />} label="Payment History" />
                            </>
                        )}

                        <div className="divider border-t border-white opacity-40 my-4"></div>
                        <DashboardLink to="/" icon={<FaHome />} label="Home" />
                        <DashboardLink to="/meals" icon={<FaUtensils />} label="Menu" />
                        <DashboardLink to="/order" icon={<FaShoppingCart />} label="Order Food" />
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Helper Component for Links
const DashboardLink = ({ to, icon, label }) => (
    <NavLink 
        to={to} 
        className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
            ${isActive ? "bg-white text-orange-500 shadow-lg font-bold" : "text-white hover:text-yellow-300 hover:bg-white/10 hover:translate-x-1"}
        `}
    >
        <motion.span whileHover={{ scale: 1.2 }} className="text-xl">{icon}</motion.span>
        {label}
    </NavLink>
);

export default Dashboard;
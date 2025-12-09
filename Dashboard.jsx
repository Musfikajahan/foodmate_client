import { NavLink, Outlet } from "react-router-dom";
import { FaShoppingCart, FaWallet, FaHome, FaUtensils, FaList, FaUsers } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAdmin from "../hooks/useAdmin";
import useChef from "../hooks/useChef";

const Dashboard = () => {
    // Fetch roles
    const [isAdmin] = useAdmin();
    const [isChef] = useChef();
    const { user } = useContext(AuthContext);

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center bg-base-100">
                {/* Mobile Menu Button */}
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden absolute top-4 left-4">Open Menu</label>
                
                {/* Main Page Content */}
                <div className="w-full p-10 min-h-screen">
                    <Outlet></Outlet>
                </div>
            </div>
            
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-chef-primary text-white">
                    {/* Sidebar Profile Header */}
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold">FoodChef</h2>
                        <p className="text-sm">Dashboard</p>
                        <div className="avatar mt-4">
                            <div className="w-20 rounded-full ring ring-white ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL} alt="User" />
                            </div>
                        </div>
                        <p className="mt-2 font-bold">{user?.displayName}</p>
                    </div>

                    {/* --- ROLE BASED LINKS --- */}
                    
                    {isAdmin ? (
                        /* --- ADMIN LINKS --- */
                        <>
                            <li><NavLink to="/dashboard/admin-home"><FaHome /> Admin Home</NavLink></li>
                            <li><NavLink to="/dashboard/all-users"><FaUsers /> Manage Users</NavLink></li>
                            <li><NavLink to="/dashboard/admin-payment-history"><FaWallet /> Payment History</NavLink></li>
                        </>
                    ) : isChef ? (
                        /* --- CHEF LINKS --- */
                        <>
                            <li><NavLink to="/dashboard/chef-home"><FaHome /> Chef Home</NavLink></li>
                            <li><NavLink to="/dashboard/add-meal"><FaUtensils /> Add New Meal</NavLink></li>
                            <li><NavLink to="/dashboard/order-requests"><FaList /> Manage Orders</NavLink></li>
                        </>
                    ) : (
                        /* --- USER LINKS (Default) --- */
                        <>
                            <li><NavLink to="/dashboard/my-profile"><FaHome /> User Home</NavLink></li>
                            <li><NavLink to="/dashboard/my-orders"><FaShoppingCart /> My Orders</NavLink></li>
                            <li><NavLink to="/dashboard/payment-history"><FaWallet /> Payment History</NavLink></li>
                        </>
                    )}

                    {/* --- SHARED LINKS (Visible to Everyone) --- */}
                    <div className="divider bg-white h-[1px] opacity-20 my-4"></div>

                    <li><NavLink to="/"><FaHome /> Home</NavLink></li>
                    <li><NavLink to="/meals"><FaList /> All Meals</NavLink></li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
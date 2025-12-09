import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useChef from "../hooks/useChef"; // 1. Import the hook

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const [isChef] = useChef(); // 2. Get Chef status

    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch(error => console.log(error));
    }

    const navOptions = <>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/meals">Meals</NavLink></li>
        
        {/* Only show Dashboard options if logged in */}
        {user && (
            <>
                <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                
                {/* 3. LOGIC: Show Payment History only if user is NOT a Chef */}
                {/* This means Admins and Regular Users WILL see it, but Chefs won't. */}
                {!isChef && (
                    <li><NavLink to="/dashboard/payment-history">Payment History</NavLink></li>
                )}
            </>
        )}
    </>

    return (
        <div className="navbar bg-base-100 shadow-md fixed z-10 bg-opacity-30 w-full px-6 text-black">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navOptions}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-2xl font-bold text-chef-primary">
                    🥘 FoodChef
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navOptions}
                </ul>
            </div>
            <div className="navbar-end">
                {user ? (
                    <>
                        <div className="avatar mr-3">
                            <div className="w-10 rounded-full ring ring-chef-primary ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL} alt="User" />
                            </div>
                        </div>
                        <button onClick={handleLogOut} className="btn btn-sm btn-error text-white">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-sm btn-outline border-chef-primary text-chef-primary mr-2">Login</Link>
                        <Link to="/register" className="btn btn-sm bg-chef-primary text-white hover:bg-orange-600">Register</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
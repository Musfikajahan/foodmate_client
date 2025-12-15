import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useChef from "../hooks/useChef";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const [isChef] = useChef();

    const handleLogOut = () => {
        logOut().catch(error => console.log(error));
    };

    const navOptions = (
        <>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `transition-colors duration-300 px-3 py-2 rounded-lg ${isActive ? "bg-orange-500 text-white" : "text-orange-700 hover:bg-yellow-100 hover:text-orange-600"}`
                    }
                >
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/meals"
                    className={({ isActive }) =>
                        `transition-colors duration-300 px-3 py-2 rounded-lg ${isActive ? "bg-orange-500 text-white" : "text-orange-700 hover:bg-yellow-100 hover:text-orange-600"}`
                    }
                >
                    Meals
                </NavLink>
            </li>
            {user && (
                <>
                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `transition-colors duration-300 px-3 py-2 rounded-lg ${isActive ? "bg-orange-500 text-white" : "text-orange-700 hover:bg-yellow-100 hover:text-orange-600"}`
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    {!isChef && (
                        <li>
                            <NavLink
                                to="/dashboard/payment-history"
                                className={({ isActive }) =>
                                    `transition-colors duration-300 px-3 py-2 rounded-lg ${isActive ? "bg-orange-500 text-white" : "text-orange-700 hover:bg-yellow-100 hover:text-orange-600"}`
                                }
                            >
                                Payment History
                            </NavLink>
                        </li>
                    )}
                </>
            )}
        </>
    );

    return (
        <div className="navbar fixed z-20 w-full bg-gradient-to-r from-yellow-100 via-orange-100 to-orange-200 backdrop-blur-md shadow-lg px-6 transition-all duration-500">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-orange-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 p-3 shadow-lg bg-orange-50 rounded-xl w-52 space-y-2"
                    >
                        {navOptions}
                    </ul>
                </div>
                <Link
                    to="/"
                    className="flex items-center gap-2 text-3xl font-extrabold text-orange-600 animate-bounce"
                >
                    <span className="text-4xl">🥘</span> FoodMate
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">{navOptions}</ul>
            </div>
            <div className="navbar-end flex items-center gap-3">
                {user ? (
                    <>
                        <div className="avatar">
                            <div className="w-12 h-12 rounded-full ring ring-orange-400 ring-offset-base-100 ring-offset-2 overflow-hidden hover:scale-110 transition-transform duration-300 flex items-center justify-center bg-orange-50">
                                {user?.photoURL ? (
                                    <img
                                        src={user.photoURL.trim()}
                                        alt="User"
                                        className="w-full h-full object-cover block"
                                    />
                                ) : (
                                    <span className="text-orange-500 text-xl font-bold">
                                        {user?.displayName ? user.displayName[0].toUpperCase() : "U"}
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleLogOut}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-red-400 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="px-4 py-2 rounded-lg border-2 border-orange-500 text-orange-600 font-medium hover:bg-orange-500 hover:text-white transition-colors duration-300"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;

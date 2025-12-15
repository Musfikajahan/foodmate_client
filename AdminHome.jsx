import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { FaUsers, FaDollarSign, FaShoppingCart, FaUtensils } from "react-icons/fa";
import CountUp from "react-countup";

const AdminHome = () => {
    const { user } = useContext(AuthContext);

    // Hardcoded stats for now (can later fetch from server)
    const stats = [
        { title: "Revenue", value: 1204, icon: <FaDollarSign />, color: "from-purple-500 to-purple-700" },
        { title: "Users", value: 34, icon: <FaUsers />, color: "from-blue-500 to-blue-700" },
        { title: "Menu Items", value: 12, icon: <FaUtensils />, color: "from-orange-400 to-orange-600" },
        { title: "Orders", value: 56, icon: <FaShoppingCart />, color: "from-pink-500 to-pink-700" },
    ];

    return (
        <div className="w-full p-6 md:p-10 bg-gradient-to-r from-orange-50 via-white to-pink-50 min-h-screen animate-fadeIn">
            <h2 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 animate-gradient-x">
                Welcome Back, Admin!
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className={`relative overflow-hidden rounded-2xl shadow-2xl transform transition duration-500 hover:scale-105 hover:shadow-3xl bg-gradient-to-br ${stat.color} text-white`}
                    >
                        <div className="card-body flex flex-col md:flex-row items-center justify-between gap-4 p-6">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold">
                                    <CountUp end={stat.value} duration={2} separator="," />
                                </h2>
                                <p className="text-sm md:text-base opacity-90">{stat.title}</p>
                            </div>
                            <div className="text-5xl opacity-30">
                                {stat.icon}
                            </div>
                        </div>
                        {/* Animated Background Shape */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse"></div>
                    </div>
                ))}
            </div>

            {/* Profile + System Health */}
            <div className="flex flex-col lg:flex-row gap-6 mt-10">
                {/* Profile Card */}
                <div className="flex-1 bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl flex items-center justify-center transform transition duration-500 hover:scale-105 hover:shadow-3xl">
                    <div className="text-center animate-fadeInUp">
                        <div className="avatar mx-auto">
                            <div className="w-28 h-28 rounded-full ring ring-gradient-to-r from-orange-400 to-pink-500 ring-offset-base-100 ring-offset-4 shadow-lg transition-transform duration-500 hover:scale-110">
                                <img src={user?.photoURL} alt="Admin Avatar" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mt-4">{user?.displayName}</h3>
                        <p className="badge badge-accent mt-2 text-lg">Administrator</p>
                    </div>
                </div>

                {/* System Health Card */}
                <div className="flex-1 bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl transform transition duration-500 hover:scale-105 hover:shadow-3xl">
                    <h3 className="text-2xl font-bold mb-6">System Health</h3>
                    <div className="mb-4">
                        <p className="text-sm font-semibold mb-1">Server Load</p>
                        <progress className="progress progress-success w-full h-4 rounded-lg transition-all duration-500" value="90" max="100"></progress>
                        <p className="text-xs text-gray-500 mt-1">90% CPU Usage</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold mb-1">Memory Usage</p>
                        <progress className="progress progress-warning w-full h-4 rounded-lg transition-all duration-500" value="40" max="100"></progress>
                        <p className="text-xs text-gray-500 mt-1">40% RAM Usage</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;

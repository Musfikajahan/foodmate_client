import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { FaUsers, FaDollarSign, FaShoppingCart, FaUtensils } from "react-icons/fa";

const AdminHome = () => {
    const { user } = useContext(AuthContext);

    // Hardcoded stats for now (Server stats require aggregation queries)
    const stats = [
        { title: "Revenue", value: "$1,204", icon: <FaDollarSign/>, color: "bg-purple-500" },
        { title: "Users", value: "34", icon: <FaUsers/>, color: "bg-blue-500" },
        { title: "Menu Items", value: "12", icon: <FaUtensils/>, color: "bg-orange-500" },
        { title: "Orders", value: "56", icon: <FaShoppingCart/>, color: "bg-pink-500" }
    ];

    return (
        <div className="w-full">
            <h2 className="text-3xl font-semibold mb-6">Hi, Welcome Back!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className={`card ${stat.color} text-white shadow-xl`}>
                        <div className="card-body flex-row items-center justify-between">
                            <div>
                                <h2 className="card-title text-3xl">{stat.value}</h2>
                                <p>{stat.title}</p>
                            </div>
                            <div className="text-4xl opacity-50">
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mt-10">
                <div className="flex-1 bg-base-200 p-8 rounded-xl shadow-lg flex items-center justify-center">
                    <div className="text-center">
                        <div className="avatar">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mt-4">{user?.displayName}</h3>
                        <p className="badge badge-accent mt-2">Administrator</p>
                    </div>
                </div>
                <div className="flex-1 bg-base-200 p-8 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">System Health</h3>
                    <progress className="progress progress-success w-full mb-2" value="90" max="100"></progress>
                    <p className="text-xs text-gray-500">Server Load: 90%</p>
                    <progress className="progress progress-warning w-full mt-4 mb-2" value="40" max="100"></progress>
                    <p className="text-xs text-gray-500">Memory Usage: 40%</p>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
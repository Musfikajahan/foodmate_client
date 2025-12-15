import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUserShield, FaUtensils } from "react-icons/fa";

const AllUsers = () => {
    const [users, setUsers] = useState([]);

    // Fetch users
    const refetch = () => {
        axios.get('https://server-vert-rho.vercel.app/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }

    useEffect(() => {
        refetch();
    }, []);

    const handleMakeAdmin = (user) => {
        axios.patch(`https://server-vert-rho.vercel.app/users/admin/${user._id}`, { role: 'admin' })
            .then(res => {
                if(res.data.modifiedCount > 0){
                    refetch();
                    Swal.fire('Success', `${user.name} is now an Admin!`, 'success');
                }
            });
    }

    const handleMakeChef = (user) => {
        axios.patch(`https://server-vert-rho.vercel.app/users/admin/${user._id}`, { role: 'chef' })
            .then(res => {
                if(res.data.modifiedCount > 0){
                    refetch();
                    Swal.fire('Success', `${user.name} is now a Chef!`, 'success');
                }
            });
    }

    return (
        <div className="w-full p-4">
            <h3 className="text-3xl font-bold text-center text-chef-primary mb-6">
                Total Users: <span className="text-orange-500">{users.length}</span>
            </h3>
            <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                <table className="table w-full border-collapse">
                    {/* Table Head */}
                    <thead className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 text-white text-lg uppercase tracking-wider">
                        <tr>
                            <th className="py-3 px-4">#</th>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-all duration-300 shadow-sm">
                                <th className="py-3 px-4">{index + 1}</th>
                                <td className="py-3 px-4 font-medium">{user.name}</td>
                                <td className="py-3 px-4">{user.email}</td>
                                <td className={`py-3 px-4 font-bold uppercase ${user.role === 'admin' ? 'text-red-500' : user.role === 'chef' ? 'text-green-500' : 'text-gray-600'}`}>
                                    {user.role || 'user'}
                                </td>
                                <td className="py-3 px-4 flex gap-3">
                                    {/* Make Admin Button */}
                                    {user.role === 'admin' ? (
                                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 font-semibold animate-pulse">Admin</span>
                                    ) : (
                                        <button
                                            onClick={() => handleMakeAdmin(user)}
                                            className="btn btn-sm bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-1"
                                        >
                                            <FaUserShield /> Admin
                                        </button>
                                    )}

                                    {/* Make Chef Button */}
                                    {user.role === 'chef' ? (
                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 font-semibold animate-pulse">Chef</span>
                                    ) : (
                                        <button
                                            onClick={() => handleMakeChef(user)}
                                            className="btn btn-sm bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-1"
                                        >
                                            <FaUtensils /> Chef
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllUsers;

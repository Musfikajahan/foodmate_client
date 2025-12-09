import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUserShield, FaUtensils, FaTrash } from "react-icons/fa";

const AllUsers = () => {
    const [users, setUsers] = useState([]);

    // Fetch users when page loads
    const refetch = () => {
        axios.get('http://localhost:5000/users')
            .then(res => setUsers(res.data));
    }

    useEffect(() => {
        refetch();
    }, []);

    const handleMakeAdmin = (user) => {
        axios.patch(`http://localhost:5000/users/admin/${user._id}`, { role: 'admin' })
            .then(res => {
                if(res.data.modifiedCount > 0){
                    refetch();
                    Swal.fire('Success', `${user.name} is now an Admin!`, 'success');
                }
            })
    }

    const handleMakeChef = (user) => {
        axios.patch(`http://localhost:5000/users/admin/${user._id}`, { role: 'chef' })
            .then(res => {
                if(res.data.modifiedCount > 0){
                    refetch();
                    Swal.fire('Success', `${user.name} is now a Chef!`, 'success');
                }
            })
    }

    return (
        <div className="w-full">
            <h3 className="text-3xl font-semibold my-4">Total Users: {users.length}</h3>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    {/* head */}
                    <thead className="bg-chef-primary text-white">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Current Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <th>{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td className="uppercase font-bold text-chef-primary">{user.role || 'user'}</td>
                                <td className="flex gap-2">
                                    {/* Make Admin Button */}
                                    {user.role === 'admin' ? 'Admin' : (
                                        <button onClick={() => handleMakeAdmin(user)} className="btn btn-ghost btn-sm bg-orange-200 text-orange-600" title="Make Admin">
                                            <FaUserShield />
                                        </button>
                                    )}
                                    {/* Make Chef Button */}
                                    {user.role === 'chef' ? 'Chef' : (
                                        <button onClick={() => handleMakeChef(user)} className="btn btn-ghost btn-sm bg-green-200 text-green-600" title="Make Chef">
                                            <FaUtensils />
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
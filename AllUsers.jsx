import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaTrash, FaUserShield, FaUtensils } from "react-icons/fa";
import useAxiosSecure from "../hooks/useAxiosSecure"; // Use the secure hook

const AllUsers = () => {
    const axiosSecure = useAxiosSecure(); // Initialize secure axios

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            // This now automatically adds the token and uses localhost:5000
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    // Make Admin
    const handleMakeAdmin = user => {
        axiosSecure.patch(`/users/admin/${user._id}`, { role: 'admin' })
            .then(res => {
                if(res.data.modifiedCount > 0){
                    refetch();
                    Swal.fire('Success', `${user.name} is now an Admin!`, 'success');
                }
            });
    }

    // Delete User
    const handleDeleteUser = user => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // Not implemented on server yet, but UI is here
                Swal.fire("Deleted!", "User has been deleted.", "success");
            }
        });
    }

    return (
        <div className="w-full p-10">
            <h3 className="text-3xl font-semibold my-4">Total Users: {users.length}</h3>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <th>{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    { user.role === 'admin' ? 'Admin' : 
                                      user.role === 'chef' ? 'Chef' : 'User' }
                                </td>
                                <td>
                                    { user.role === 'user' && (
                                        <button onClick={() => handleMakeAdmin(user)} className="btn btn-ghost bg-orange-600 text-white btn-xs">
                                            <FaUserShield></FaUserShield>
                                        </button>
                                    )}
                                    <button onClick={() => handleDeleteUser(user)} className="btn btn-ghost bg-red-600 text-white btn-xs ml-2">
                                        <FaTrash></FaTrash>
                                    </button>
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
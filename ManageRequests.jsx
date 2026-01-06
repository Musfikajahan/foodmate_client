import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaCheck, FaTimes } from "react-icons/fa";
import useAxiosSecure from "../hooks/useAxiosSecure"; // Use secure hook

const ManageRequests = () => {
    const axiosSecure = useAxiosSecure();

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users-requests'],
        queryFn: async () => {
            // Uses secure connection to fetch all users
            const res = await axiosSecure.get('/users');
            // Filter only those who have 'requested' status
            return res.data.filter(user => user.status === 'requested');
        }
    });

    const handleApprove = (user) => {
        axiosSecure.patch(`/users/admin/${user._id}`, { role: user.requestedRole })
        .then(res => {
            if(res.data.modifiedCount > 0){
                refetch();
                Swal.fire('Approved', `${user.name} is now a ${user.requestedRole}!`, 'success');
            }
        });
    };

    const handleReject = (user) => {
        axiosSecure.patch(`/users/admin/${user._id}`, { role: 'user' }) // Reset to user
        .then(res => {
            if(res.data.modifiedCount > 0){
                refetch();
                Swal.fire('Rejected', 'Request cancelled.', 'info');
            }
        });
    };

    return (
        <div className="p-10 w-full">
            <h2 className="text-3xl font-bold mb-8 text-center text-purple-600">Manage Role Requests</h2>
            
            {users.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    <p className="text-xl">No pending requests at the moment.</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-xl rounded-2xl">
                    <table className="table w-full bg-white">
                        <thead className="bg-purple-500 text-white">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Current Role</th>
                                <th>Requested Role</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <th>{index + 1}</th>
                                    <td className="font-bold">{user.name}</td>
                                    <td>{user.email}</td>
                                    <td className="uppercase badge badge-ghost mt-3">{user.role}</td>
                                    <td className="uppercase font-bold text-orange-500">{user.requestedRole}</td>
                                    <td className="flex justify-center gap-4">
                                        <button onClick={() => handleApprove(user)} className="btn btn-sm btn-success text-white"><FaCheck /></button>
                                        <button onClick={() => handleReject(user)} className="btn btn-sm btn-error text-white"><FaTimes /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageRequests;
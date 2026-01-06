import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom"; // ✅ Imported Link

const MyProfile = () => {
    const { user } = useContext(AuthContext);

    const { data: dbUser = {}, refetch } = useQuery({
        queryKey: ['userProfile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000
/users/profile/${user.email}`);
            return res.data;
        }
    });

    const handleRoleRequest = (role) => {
        axios.post('http://localhost:5000/users/request-role', { 
            email: user.email, 
            requestedRole: role 
        })
        .then(res => {
            if(res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
                Swal.fire('Success', `Request to become ${role} sent!`, 'success');
                refetch();
            } else {
                Swal.fire('Info', 'Request already sent.', 'info');
            }
        });
    }

    return (
        <div className="flex flex-col items-center justify-center pt-10 pb-10">
            <div className="card w-96 bg-white shadow-2xl border border-gray-100 rounded-3xl overflow-hidden">
                <figure className="pt-10 bg-gradient-to-b from-orange-100 to-white">
                    <div className="avatar">
                        <div className="w-32 h-32 rounded-full ring ring-chef-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                            {/* Use DB image first, fallback to Firebase auth image */}
                            <img src={dbUser.image || user?.photoURL} alt="profile" className="object-cover w-full h-full" />
                        </div>
                    </div>
                </figure>
                <div className="card-body items-center text-center p-8">
                    <h2 className="text-3xl font-extrabold text-gray-800">{dbUser.name || user?.displayName}</h2>
                    <p className="text-gray-500 font-medium">{dbUser.email}</p>
                    
                    <div className="flex gap-2 mt-3">
                        <div className="badge badge-primary badge-outline uppercase p-3 font-bold">{dbUser.role || 'User'}</div>
                        <div className={`badge ${dbUser.status === 'active' ? 'badge-success' : 'badge-error'} text-white uppercase p-3 font-bold`}>
                            {dbUser.status || 'Active'}
                        </div>
                    </div>

                    <div className="mt-4 w-full bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-400 uppercase font-bold tracking-wider">Address</p>
                        <p className="text-gray-700 font-semibold break-words">{dbUser.address || "No address set"}</p>
                    </div>

                    {dbUser.role === 'chef' && (
                        <div className="mt-2 w-full bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <p className="text-sm text-orange-400 uppercase font-bold tracking-wider">Chef ID</p>
                            <p className="text-orange-700 font-mono text-xs">{dbUser._id}</p>
                        </div>
                    )}

                    <div className="card-actions mt-6 flex-col w-full gap-3">
                        {dbUser.role === 'user' && dbUser.status !== 'requested' && (
                            <>
                                <button onClick={() => handleRoleRequest('chef')} className="btn btn-outline border-orange-500 text-orange-600 w-full">Request Chef</button>
                                <button onClick={() => handleRoleRequest('admin')} className="btn btn-outline border-purple-500 text-purple-600 w-full">Request Admin</button>
                            </>
                        )}
                        {/* ✅ FIX: Wrapped button in Link */}
                        <Link to="/dashboard/edit-profile" className="w-full">
                            <button className="btn bg-gray-800 text-white w-full hover:scale-105 transition-transform">
                                Edit Profile
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
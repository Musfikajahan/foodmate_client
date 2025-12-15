import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const MyProfile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate(); // For routing to Edit Profile

    return (
        <div className="flex flex-col items-center justify-center pt-10">
            <div className="card w-96 bg-base-100 shadow-xl border border-gray-200">
                <figure className="px-10 pt-10">
                    <div className="avatar">
                        <div className="w-32 rounded-full ring ring-chef-primary ring-offset-base-100 ring-offset-2">
                            <img src={user?.photoURL} alt="profile" />
                        </div>
                    </div>
                </figure>
                <div className="card-body items-center text-center">
                    <h2 className="card-title text-2xl font-bold">{user?.displayName}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                    <div className="badge badge-accent badge-outline mt-2 uppercase">User</div>

                    <div className="card-actions mt-6 w-full">
                        <div className="stats shadow w-full">
                            <div className="stat place-items-center">
                                <div className="stat-title">Role</div>
                                <div className="stat-value text-chef-primary text-xl">Foodie</div>
                            </div>
                            <div className="stat place-items-center">
                                <div className="stat-title">Status</div>
                                <div className="stat-value text-secondary text-xl">Active</div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Button */}
                    <button
                        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        onClick={() => navigate("/dashboard/edit-profile")}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;

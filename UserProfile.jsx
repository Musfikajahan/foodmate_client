import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const UserProfile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="hero min-h-[60vh] bg-base-200 rounded-xl">
            <div className="hero-content text-center">
                <div className="max-w-md">

                    <div className="avatar mb-6">
                        <div className="w-32 rounded-full ring ring-chef-primary ring-offset-base-100 ring-offset-2 shadow-2xl">
                            <img src={user?.photoURL} alt="Profile" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold mb-2">Welcome, {user?.displayName}!</h1>
                    <p className="text-gray-500 mb-6">{user?.email}</p>

                    <div className="stats shadow w-full">
                        <div className="stat place-items-center">
                            <div className="stat-title">Role</div>
                            <div className="stat-value text-chef-primary uppercase text-2xl">User</div>
                        </div>

                        <div className="stat place-items-center">
                            <div className="stat-title">Status</div>
                            <div className="stat-value text-secondary text-2xl">Active</div>
                        </div>
                    </div>

                    <button className="btn btn-primary mt-6 bg-chef-primary border-none">Edit Profile</button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
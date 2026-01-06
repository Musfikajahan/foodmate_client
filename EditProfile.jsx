import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";

// ✅ FIX: Use your REAL ImgBB API Key here
const image_hosting_key = "80137ce7dff81fd4db47ee5094362a63"; 
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const EditProfile = () => {
    const { user, updateUserProfile } = useContext(AuthContext);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);
    const [dbUser, setDbUser] = useState(null);

    // 1. Fetch current full profile data on mount
    useEffect(() => {
        if(user?.email) {
            axiosSecure.get(`/users/profile/${user.email}`)
                .then(res => {
                    setDbUser(res.data);
                    setValue("name", res.data.name || user.displayName);
                    setValue("address", res.data.address || "");
                });
        }
    }, [user, axiosSecure, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        let photoURL = dbUser.image || user.photoURL; // Default to existing image

        // 2. Handle Image Upload if a new file is selected
        if (data.image && data.image[0]) {
            const formData = new FormData();
            formData.append('image', data.image[0]);

            try {
                const res = await axios.post(image_hosting_api, formData, {
                    headers: { 'content-type': 'multipart/form-data' }
                });
                if (res.data.success) {
                    photoURL = res.data.data.display_url;
                }
            } catch (error) {
                console.error("Image upload failed", error);
                Swal.fire('Error', 'Image upload failed. Check API Key.', 'error');
                setLoading(false);
                return;
            }
        }

        // 3. Prepare data for update
        const updatedInfo = {
            name: data.name,
            address: data.address,
            photoURL: photoURL
        };

        // 4. Update MongoDB Database
        const dbResponse = await axiosSecure.patch(`/users/profile/${user.email}`, updatedInfo);

        if(dbResponse.data.modifiedCount > 0 || dbResponse.data.matchedCount > 0) {
            // 5. Update Firebase Auth State
            updateUserProfile(data.name, photoURL)
                .then(() => {
                    setLoading(false);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Profile updated successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate('/dashboard/my-profile');
                })
                .catch(error => {
                    setLoading(false);
                    Swal.fire('Error', error.message, 'error');
                });
        } else {
            setLoading(false);
            navigate('/dashboard/my-profile');
        }
    };

    if (!dbUser) {
        return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-orange-500"></span></div>;
    }

    return (
        <div className="w-full p-10 flex justify-center">
            <div className="card w-full max-w-2xl bg-base-100 shadow-2xl rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-6 text-center text-white">
                    <h2 className="text-3xl font-bold">Edit Profile</h2>
                    <p>Update your personal information</p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="card-body p-10">
                    <div className="form-control">
                        <label className="label"><span className="label-text font-bold">Email (Cannot be changed)</span></label>
                        <input type="text" value={user?.email} disabled className="input input-bordered bg-gray-100 cursor-not-allowed" />
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text font-bold">Full Name</span></label>
                        <input 
                            type="text" 
                            {...register("name", { required: true })} 
                            className="input input-bordered focus:border-orange-500" 
                        />
                        {errors.name && <span className="text-red-500 text-sm mt-1">Name is required</span>}
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text font-bold">Address</span></label>
                        <textarea 
                            {...register("address")} 
                            className="textarea textarea-bordered h-24 focus:border-orange-500" 
                            placeholder="Enter your delivery address"
                        ></textarea>
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text font-bold">Profile Image</span></label>
                        <div className="flex items-center gap-4">
                            <div className="avatar">
                                <div className="w-16 rounded-full ring ring-orange-400 ring-offset-base-100 ring-offset-2">
                                    <img src={dbUser.image || user.photoURL} alt="Current profile" />
                                </div>
                            </div>
                            <input 
                                type="file" 
                                {...register("image")} 
                                className="file-input file-input-bordered file-input-warning w-full max-w-xs" 
                            />
                        </div>
                        <label className="label"><span className="label-text-alt text-gray-500">Leave empty to keep current image</span></label>
                    </div>

                    <div className="form-control mt-6">
                        <button type="submit" className={`btn btn-primary bg-gradient-to-r from-orange-500 to-pink-500 border-none text-white text-lg ${loading ? 'loading' : ''}`}>
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
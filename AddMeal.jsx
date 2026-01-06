import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useLoaderData, useNavigate } from "react-router-dom"; 

// ✅ YOUR API KEY
const image_hosting_key = "80137ce7dff81fd4db47ee5094362a63"; 
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddMeal = () => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure(); 
    
    // ✅ 1. Get data if in Edit Mode
    const loadedData = useLoaderData(); 
    const navigate = useNavigate();
    const isEditMode = !!loadedData?._id;

    // ✅ 2. Pre-fill form if Editing
    useEffect(() => {
        if (isEditMode) {
            setValue("name", loadedData.title);
            setValue("category", loadedData.category);
            setValue("price", loadedData.price);
            setValue("recipe", loadedData.description);
        }
    }, [isEditMode, loadedData, setValue]);

    const onSubmit = async (data) => {
        let imageUrl = loadedData?.image; // Default to existing image if editing

        // ✅ 3. Check if new image is uploaded
        if (data.image && data.image[0]) {
            const formData = new FormData();
            formData.append('image', data.image[0]);

            try {
                const res = await axios.post(image_hosting_api, formData, {
                    headers: { 'content-type': 'multipart/form-data' }
                });
                if (res.data.success) {
                    imageUrl = res.data.data.display_url;
                }
            } catch (error) {
                console.error("Image upload failed", error);
                return Swal.fire('Error', 'Image upload failed', 'error');
            }
        }

        const menuItem = {
            title: data.name,
            category: data.category,
            price: parseFloat(data.price),
            description: data.recipe,
            image: imageUrl,
            
            // ✅ CRITICAL FIX: Keep original Chef info if editing, otherwise use current User
            chefName: isEditMode ? loadedData.chefName : user?.displayName,
            chefEmail: isEditMode ? loadedData.chefEmail : user?.email,
            
            // Only add date/likes/rating if it's NEW, otherwise ignore
            ...(isEditMode ? {} : {
                likes: 0,
                reviews_count: 0,
                postDate: new Date(),
                rating: 0
            })
        };

        try {
            if (isEditMode) {
                // ✅ UPDATE LOGIC (PATCH)
                const menuRes = await axiosSecure.patch(`/meals/${loadedData._id}`, menuItem);
                if (menuRes.data.modifiedCount > 0) {
                    reset();
                    Swal.fire('Success', 'Meal Updated Successfully!', 'success');
                    navigate(-1); // Go back to previous page (works for both Admin & Chef)
                }
            } else {
                // ✅ ADD LOGIC (POST)
                const menuRes = await axiosSecure.post('/meals', menuItem);
                if (menuRes.data.insertedId) {
                    reset();
                    Swal.fire('Success', 'Meal Added Successfully!', 'success');
                    navigate('/dashboard/chef-home');
                }
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Something went wrong', 'error');
        }
    };

    return (
        <div className="w-full p-10">
            <h2 className="text-4xl font-bold text-center mb-10 text-orange-500">
                {isEditMode ? "Update Meal" : "Add New Meal"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto">
                
                <div className="form-control w-full mb-4">
                    <label className="label"><span className="label-text font-bold">Recipe Name*</span></label>
                    <input type="text" {...register("name", {required: true})} className="input input-bordered w-full" />
                </div>

                <div className="flex gap-6 mb-4">
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-bold">Category*</span></label>
                        <select defaultValue="default" {...register("category", {required: true})} className="select select-bordered w-full">
                            <option disabled value="default">Select a category</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Dessert">Dessert</option>
                        </select>
                    </div>
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-bold">Price*</span></label>
                        <input type="number" step="0.01" {...register("price", {required: true})} className="input input-bordered w-full" />
                    </div>
                </div>

                <div className="form-control w-full mb-4">
                    <label className="label"><span className="label-text font-bold">Details*</span></label>
                    <textarea {...register("recipe", {required: true})} className="textarea textarea-bordered h-24"></textarea>
                </div>

                <div className="form-control w-full mb-6">
                    <label className="label"><span className="label-text font-bold">Image {isEditMode ? "(Optional)" : "*"}</span></label>
                    <input type="file" {...register("image", {required: !isEditMode})} className="file-input file-input-bordered w-full" />
                    {isEditMode && <span className="text-xs text-gray-500 mt-1">Leave empty to keep current image</span>}
                </div>

                <button className="btn w-full bg-orange-500 text-white font-bold hover:bg-orange-600">
                    {isEditMode ? "Update Item" : "Add Item"}
                </button>
            </form>
        </div>
    );
};

export default AddMeal;
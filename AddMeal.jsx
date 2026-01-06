import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

// ✅ YOUR API KEY
const image_hosting_key = "80137ce7dff81fd4db47ee5094362a63"; 
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddMeal = () => {
    const { register, handleSubmit, reset } = useForm();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure(); // Now this imports the correct hook

    const onSubmit = async (data) => {
        // 1. Upload Image
        const formData = new FormData();
        formData.append('image', data.image[0]);

        try {
            const res = await axios.post(image_hosting_api, formData, {
                headers: { 'content-type': 'multipart/form-data' }
            });

            if (res.data.success) {
                const menuItem = {
                    title: data.name,
                    category: data.category,
                    price: parseFloat(data.price),
                    description: data.recipe,
                    image: res.data.data.display_url,
                    chefName: user?.displayName,
                    chefEmail: user?.email,
                    ingredients: [data.ingredient1, data.ingredient2, data.ingredient3].filter(Boolean), 
                    rating: 0,
                    likes: 0,
                    reviews_count: 0,
                    postDate: new Date()
                };

                // 2. Save to DB
                const menuRes = await axiosSecure.post('/meals', menuItem);

                if (menuRes.data.insertedId) {
                    reset();
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `${data.name} added!`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        } catch (error) {
            console.error("Error adding meal:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    };

    return (
        <div className="w-full p-10">
            <h2 className="text-4xl font-bold text-center mb-10 text-orange-500">Add New Meal</h2>
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
                        <input type="number" {...register("price", {required: true})} className="input input-bordered w-full" />
                    </div>
                </div>

                <div className="form-control w-full mb-4">
                    <label className="label"><span className="label-text font-bold">Details*</span></label>
                    <textarea {...register("recipe", {required: true})} className="textarea textarea-bordered h-24"></textarea>
                </div>

                <div className="form-control w-full mb-6">
                    <label className="label"><span className="label-text font-bold">Image*</span></label>
                    <input type="file" {...register("image", {required: true})} className="file-input file-input-bordered w-full" />
                </div>

                <button className="btn w-full bg-orange-500 text-white font-bold hover:bg-orange-600">Add Item</button>
            </form>
        </div>
    );
};

export default AddMeal;
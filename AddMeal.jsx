import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/useAxiosPublic"; 
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";


const image_hosting_key = "e1234567890abcdef1234567890abcdef"; 
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddMeal = () => {
    const { register, handleSubmit, reset } = useForm();
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    const onSubmit = async (data) => {
        // 1. Upload Image to ImgBB
        const formData = new FormData();
        formData.append('image', data.image[0]);

        try {
            let imageUrl = "";

            try {
                const res = await axios.post(image_hosting_api, formData, {
                    headers: { 'content-type': 'multipart/form-data' }
                });
                if(res.data.success) {
                    imageUrl = res.data.data.display_url;
                }
            } catch (err) {
                console.error("ImgBB Upload Failed. Check your API KEY.", err);
                imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                Swal.fire({
                    icon: 'warning',
                    title: 'Image Upload Failed',
                    text: 'Using a default image because the API Key is invalid.',
                });
            }

            // 2. Send Data to Database
            if (imageUrl) {
                const menuItem = {
                    title: data.name,
                    category: data.category,
                    price: parseFloat(data.price),
                    description: data.recipe,
                    image: imageUrl,
                    chefName: user?.displayName,
                    chefEmail: user?.email,
                    ingredients: [data.ingredient1, data.ingredient2, data.ingredient3].filter(Boolean), 
                    rating: 0,
                    likes: 0,
                    reviews_count: 0,
                    postDate: new Date()
                }

                // This now works because we fixed index.js
                const menuRes = await axiosPublic.post('/meals', menuItem);

                if (menuRes.data.insertedId) {
                    reset();
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `${data.name} added!`,
                        text: "Your meal is now live.",
                        showConfirmButton: false,
                        timer: 2500
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
        <div className="w-full p-6 md:p-12 bg-gradient-to-r from-orange-100 via-white to-pink-100 min-h-screen animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 animate-gradient-x">
                Add New Meal
            </h2>
            <div className="max-w-3xl mx-auto bg-white bg-opacity-90 p-8 md:p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Recipe Name */}
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-semibold text-lg">Recipe Name*</span></label>
                        <input 
                            type="text" 
                            placeholder="Recipe Name" 
                            {...register('name', { required: true })} 
                            className="input input-bordered w-full focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition duration-300 hover:scale-105"
                        />
                    </div>

                    {/* Category & Price */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-semibold text-lg">Category*</span></label>
                            <select 
                                defaultValue="default" 
                                {...register('category', { required: true })} 
                                className="select select-bordered w-full focus:ring-2 focus:ring-pink-400 transition duration-300 hover:scale-105"
                            >
                                <option disabled value="default">Select a category</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Dessert">Dessert</option>
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-semibold text-lg">Price*</span></label>
                            <input 
                                type="number" 
                                placeholder="Price" 
                                {...register('price', { required: true })} 
                                className="input input-bordered w-full focus:ring-2 focus:ring-orange-300 transition duration-300 hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-semibold text-lg">Key Ingredients</span></label>
                        <div className="flex gap-2 flex-wrap">
                            <input type="text" placeholder="Ingredient 1" {...register('ingredient1')} className="input input-bordered w-1/3 min-w-[120px] hover:scale-105 transition-transform duration-300" />
                            <input type="text" placeholder="Ingredient 2" {...register('ingredient2')} className="input input-bordered w-1/3 min-w-[120px] hover:scale-105 transition-transform duration-300" />
                            <input type="text" placeholder="Ingredient 3" {...register('ingredient3')} className="input input-bordered w-1/3 min-w-[120px] hover:scale-105 transition-transform duration-300" />
                        </div>
                    </div>

                    {/* Recipe Details */}
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-semibold text-lg">Recipe Details</span></label>
                        <textarea 
                            {...register('recipe')} 
                            placeholder="Description..." 
                            className="textarea textarea-bordered h-28 focus:ring-2 focus:ring-pink-300 transition duration-300 hover:scale-105"
                        ></textarea>
                    </div>

                    {/* Meal Image */}
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-semibold text-lg">Meal Image*</span></label>
                        <input 
                            {...register('image', { required: true })} 
                            type="file" 
                            className="file-input file-input-bordered w-full max-w-xs hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Submit Button */}
                    <button className="btn w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold hover:scale-105 hover:shadow-lg transition-transform duration-300">
                        Add Item
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddMeal;
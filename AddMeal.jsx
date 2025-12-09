import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/useAxiosPublic"; 
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

// ⚠️ IMPORTANT: Replace this with your REAL key from https://api.imgbb.com/
// If you don't have one, the code below has a fallback to a dummy image.
const image_hosting_key = "e1234567890abcdef1234567890abcdef"; 
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddMeal = () => {
    const { register, handleSubmit, reset } = useForm();
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic(); // Use the hook we just created

    const onSubmit = async (data) => {
        // 1. Prepare Image Upload using FormData (Required for files)
        const formData = new FormData();
        formData.append('image', data.image[0]);

        try {
            let imageUrl = "";

            // 2. Try to Upload Image
            try {
                const res = await axios.post(image_hosting_api, formData, {
                    headers: { 'content-type': 'multipart/form-data' }
                });
                imageUrl = res.data.data.display_url;
            } catch (err) {
                console.error("ImgBB Upload Failed (Likely invalid Key). Using dummy image.");
                // Fallback image so you can still test the functionality
                imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
            }

            if (imageUrl) {
                // 3. Prepare Meal Data
                const menuItem = {
                    title: data.name,
                    category: data.category,
                    price: parseFloat(data.price),
                    description: data.recipe,
                    image: imageUrl,
                    chefName: user?.displayName,
                    chefEmail: user?.email, // <--- CRITICAL: This links the meal to YOU
                    ingredients: [data.ingredient1, data.ingredient2, data.ingredient3].filter(Boolean), 
                    rating: 0,
                    likes: 0,
                    reviews_count: 0,
                    postDate: new Date()
                }

                // 4. Save to Database
                const menuRes = await axiosPublic.post('/meals', menuItem);

                if (menuRes.data.insertedId) {
                    reset();
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `${data.name} added!`,
                        text: "Now log in as a User and order this item to test.",
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
        <div className="w-full p-4">
             <h2 className="text-3xl font-semibold text-center mb-8 text-chef-primary">Add a New Meal</h2>
            <div className="bg-base-200 p-8 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Recipe Name */}
                    <div className="form-control w-full my-6">
                        <label className="label"><span className="label-text">Recipe Name*</span></label>
                        <input type="text" placeholder="Recipe Name" {...register('name', { required: true })} className="input input-bordered w-full" />
                    </div>

                    {/* Category & Price */}
                    <div className="flex gap-6">
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text">Category*</span></label>
                            <select defaultValue="default" {...register('category', { required: true })} className="select select-bordered w-full">
                                <option disabled value="default">Select a category</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Dessert">Dessert</option>
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label"><span className="label-text">Price*</span></label>
                            <input type="number" placeholder="Price" {...register('price', { required: true })} className="input input-bordered w-full" />
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="form-control w-full my-4">
                        <label className="label"><span className="label-text">Key Ingredients</span></label>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Ingredient 1" {...register('ingredient1')} className="input input-bordered w-1/3" />
                            <input type="text" placeholder="Ingredient 2" {...register('ingredient2')} className="input input-bordered w-1/3" />
                            <input type="text" placeholder="Ingredient 3" {...register('ingredient3')} className="input input-bordered w-1/3" />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Recipe Details</span></label>
                        <textarea {...register('recipe')} className="textarea textarea-bordered h-24" placeholder="Description..."></textarea>
                    </div>

                    {/* Image File */}
                    <div className="form-control w-full my-6">
                        <label className="label"><span className="label-text">Meal Image*</span></label>
                        <input {...register('image', { required: true })} type="file" className="file-input file-input-bordered w-full max-w-xs" />
                    </div>

                    <button className="btn bg-chef-primary text-white w-full">Add Item</button>
                </form>
            </div>
        </div>
    );
};

export default AddMeal;
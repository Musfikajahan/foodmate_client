import { useLoaderData, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";

const UpdateMeal = () => {
    // We assume the route loader fetches the meal data by ID
    const meal = useLoaderData();
    const { _id, title, price, description, category, image } = meal;
    
    const { register, handleSubmit } = useForm();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        // If image is updated, you'd handle upload here similarly to AddMeal.
        // For simplicity in update, we assume text updates or re-pasting URL if using external link logic.
        // If using ImgBB, checking if data.image is a filelist or string is needed.
        // Here we just send the data assuming direct update or keeping old image.
        
        const menuItem = {
            title: data.title,
            category: data.category,
            price: parseFloat(data.price),
            description: data.description,
            // If new image upload logic isn't re-implemented here, keep old image or handle upload
            image: image 
        };

        const menuRes = await axiosSecure.patch(`/meals/${_id}`, menuItem);
        if(menuRes.data.modifiedCount > 0){
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${data.title} is updated to the menu.`,
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/dashboard/chef-home'); // Redirect to My Meals
        }
    };

    return (
        <div className="p-10 w-full bg-base-100 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-8">Update Item</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control w-full mb-6">
                    <label className="label"><span className="label-text font-bold">Recipe Name*</span></label>
                    <input 
                        type="text" 
                        defaultValue={title}
                        {...register('title', { required: true })}
                        className="input input-bordered w-full" 
                    />
                </div>

                <div className="flex gap-6 mb-6">
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-bold">Category*</span></label>
                        <select 
                            defaultValue={category}
                            {...register('category', { required: true })}
                            className="select select-bordered w-full"
                        >
                            <option disabled value="default">Select a category</option>
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="dessert">Dessert</option>
                            <option value="drinks">Drinks</option>
                        </select>
                    </div>

                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-bold">Price*</span></label>
                        <input 
                            type="number" 
                            step="0.01"
                            defaultValue={price}
                            {...register('price', { required: true })}
                            className="input input-bordered w-full" 
                        />
                    </div>
                </div>

                <div className="form-control w-full mb-6">
                    <label className="label"><span className="label-text font-bold">Recipe Details</span></label>
                    <textarea 
                        defaultValue={description}
                        {...register('description')}
                        className="textarea textarea-bordered h-24" 
                    ></textarea>
                </div>

                <button className="btn btn-warning w-full text-white font-bold text-lg">
                    Update Meal Details
                </button>
            </form>
        </div>
    );
};

export default UpdateMeal;
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const MyMeals = () => {
    const { user } = useContext(AuthContext);
    const [meals, setMeals] = useState([]);

    const fetchMeals = () => {
        if(user?.email){
            axios.get(`https://server-vert-rho.vercel.app/meals/chef/${user.email}`)
            .then(res => setMeals(res.data));
        }
    }

    useEffect(() => {
        fetchMeals();
    }, [user]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`https://server-vert-rho.vercel.app/meals/${id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            fetchMeals();
                            Swal.fire("Deleted!", "Your meal has been deleted.", "success");
                        }
                    })
            }
        });
    }

    return (
        <div className="pt-6 px-4 max-w-screen-xl mx-auto min-h-screen">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">My Menu Items: {meals.length}</h2>

            <div className="overflow-x-auto">
                <table className="table w-full border-separate border-spacing-y-2">
                    <thead>
                        <tr className="bg-gradient-to-r from-chef-primary to-orange-400 text-white">
                            <th className="rounded-tl-lg">#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Likes</th>
                            <th className="rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                        {meals.map((item, index) => (
                            <motion.tr
                                key={item._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white shadow-md rounded-xl hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                <th>{index + 1}</th>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={item.image} alt={item.title} className="transition-transform duration-300 hover:scale-110"/>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="font-semibold text-gray-800">{item.title}</td>
                                <td className="text-chef-primary font-bold">${item.price}</td>
                                <td className="text-yellow-500 font-semibold">{item.likes}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="btn btn-ghost btn-lg text-red-600 hover:bg-red-100 hover:text-red-800 transition-all duration-300 rounded-full p-3"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyMeals;

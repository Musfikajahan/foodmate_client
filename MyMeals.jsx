import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query"; 
import Swal from "sweetalert2";
import { FaTrash, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure"; 

const MyMeals = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    // Fetch meals specific to this Chef
    const { data: meals = [], refetch } = useQuery({
        queryKey: ['my-meals', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/meals/chef/${user.email}`);
            return res.data;
        }
    });

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
                axiosSecure.delete(`/meals/${id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch(); 
                            Swal.fire("Deleted!", "Your meal has been deleted.", "success");
                        }
                    })
            }
        });
    }

    return (
        <div className="w-full p-10">
            <h2 className="text-3xl font-bold mb-5 text-center">My Added Meals: {meals.length}</h2>
            <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
                <table className="table w-full">
                    <thead className="bg-gradient-to-r from-orange-400 to-pink-500 text-white">
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Likes</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                        {meals.map((item, index) => (
                            <motion.tr 
                                key={item._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="hover:bg-orange-50 transition-colors"
                            >
                                <th>{index + 1}</th>
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img src={item.image} alt={item.title} />
                                        </div>
                                    </div>
                                </td>
                                <td className="font-semibold text-gray-800">{item.title}</td>
                                <td className="text-orange-600 font-bold">${item.price}</td>
                                <td className="text-yellow-500 font-semibold">{item.likes || 0}</td>
                                <td className="flex justify-center gap-3">
                                    <Link to={`/dashboard/update-meal/${item._id}`}>
                                        <button className="btn btn-ghost btn-lg text-orange-500">
                                            <FaEdit />
                                        </button>
                                    </Link>
                                    <button onClick={() => handleDelete(item._id)} className="btn btn-ghost btn-lg text-red-600">
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
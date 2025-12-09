import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash, FaEdit } from "react-icons/fa";

const MyMeals = () => {
    const { user } = useContext(AuthContext);
    const [meals, setMeals] = useState([]);

    const fetchMeals = () => {
        if(user?.email){
            axios.get(`http://localhost:5000/meals/chef/${user.email}`)
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
                axios.delete(`http://localhost:5000/meals/${id}`)
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
        <div>
             <h2 className="text-3xl font-semibold mb-8">My Menu Items: {meals.length}</h2>
             <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-chef-primary text-white">
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Likes</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meals.map((item, index) => (
                            <tr key={item._id}>
                                <th>{index + 1}</th>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={item.image} alt={item.title} />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>{item.title}</td>
                                <td>${item.price}</td>
                                <td>{item.likes}</td>
                                <td>
                                    <button onClick={() => handleDelete(item._id)} className="btn btn-ghost btn-lg text-red-600">
                                        <FaTrash></FaTrash>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyMeals;
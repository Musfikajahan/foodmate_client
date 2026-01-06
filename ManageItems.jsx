import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; 
import { Link } from "react-router-dom";

const ManageItems = () => {
    const axiosSecure = useAxiosSecure();
    
    // State 1: What the user is typing (Input box)
    const [searchTerm, setSearchTerm] = useState('');
    
    // State 2: What we actually send to the server (Triggered on Enter/Click)
    const [activeSearch, setActiveSearch] = useState('');
    
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10; 

    // ✅ QUERY: This depends on 'activeSearch', not the typing state
    const { data: meals = [], refetch, isLoading } = useQuery({
        queryKey: ['meals', currentPage, activeSearch], 
        queryFn: async () => {
            console.log(`Sending Search Request: ${activeSearch}`); // Debug log
            const res = await axiosSecure.get(`/meals?page=${currentPage}&limit=${itemsPerPage}&search=${activeSearch}`);
            return res.data;
        }
    });

    const { data: countData = { count: 0 } } = useQuery({
        queryKey: ['mealsCount', activeSearch],
        queryFn: async () => {
            const res = await axiosSecure.get(`/mealsCount?search=${activeSearch}`);
            return res.data;
        }
    });

    const numberOfPages = Math.ceil(countData.count / itemsPerPage);
    const pages = [...Array(numberOfPages).keys()];

    const handleDeleteItem = (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(`/meals/${item._id}`);
                if (res.data.deletedCount > 0) {
                    refetch();
                    Swal.fire({
                        title: "Deleted!",
                        text: `${item.title} has been deleted.`,
                        icon: "success"
                    });
                }
            }
        });
    };

    // ✅ HANDLE SEARCH SUBMIT (Pressing Enter or Click)
    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Stop page reload
        setActiveSearch(searchTerm); // Trigger the API call
        setCurrentPage(0); // Reset to page 1
    };

    if (isLoading) return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-orange-500"></span></div>;

    return (
        <div className="w-full p-10">
            <h2 className="text-3xl font-bold text-center mb-8">Manage All Items</h2>

            {/* ✅ Search Bar Section (Wrapped in Form for Enter Key support) */}
            <div className="flex justify-center mb-8">
                <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md flex gap-2">
                    <div className="relative w-full">
                        <input 
                            type="text" 
                            // Update typing state
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            placeholder="Search by name, title, or category..." 
                            className="input input-bordered w-full pl-10 border-orange-400 focus:border-orange-600 focus:ring-1 focus:ring-orange-600" 
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <button type="submit" className="btn btn-primary bg-orange-500 border-none text-white">
                        Search
                    </button>
                </form>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
                <table className="table w-full">
                    <thead className="bg-orange-500 text-white uppercase">
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meals.map((item, index) => (
                            <tr key={item._id} className="hover:bg-orange-50">
                                <th>
                                    {(currentPage * itemsPerPage) + index + 1}
                                </th>
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img src={item.image} alt={item.title} />
                                        </div>
                                    </div>
                                </td>
                                <td className="font-bold text-gray-600">
                                    {/* ✅ FIX: Show Title OR Name (Handles old and new items) */}
                                    {item.title || item.name}
                                </td>
                                <td className="text-right pr-12 font-bold text-gray-600">
                                    ${item.price}
                                </td>
                                <td>
                                    <Link to={`/dashboard/update-meal/${item._id}`}>
                                        <button className="btn btn-ghost btn-sm bg-orange-500 text-white">
                                            <FaEdit className="text-lg" />
                                        </button>
                                    </Link>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleDeleteItem(item)}
                                        className="btn btn-ghost btn-sm bg-red-600 text-white"
                                    >
                                        <FaTrashAlt className="text-lg" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-8 gap-2">
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} 
                    className="btn btn-sm btn-outline"
                    disabled={currentPage === 0}
                >
                    Prev
                </button>
                
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`btn btn-sm ${currentPage === page ? 'bg-orange-500 text-white' : 'btn-outline'}`}
                    >
                        {page + 1}
                    </button>
                ))}

                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, numberOfPages - 1))} 
                    className="btn btn-sm btn-outline"
                    disabled={currentPage === numberOfPages - 1}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ManageItems;
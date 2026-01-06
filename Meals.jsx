import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Meals = () => {
    // 1. Search State
    const [search, setSearch] = useState(''); 
    const [searchText, setSearchText] = useState(''); // Text inside input box

    // 2. Pagination State
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10; // How many items per page?

    // 3. Fetch Meals from Server (Server does the searching!)
    const { data: meals = [], refetch, isLoading } = useQuery({
        queryKey: ['meals', currentPage, search], // Refetch when Page or Search changes
        queryFn: async () => {
            // This URL tells the server: "Search the WHOLE DB for 'dal', give me page 0"
            const res = await axios.get(`https://foodmate-server-v2.vercel.app/meals?page=${currentPage}&limit=${itemsPerPage}&search=${search}`);
            return res.data;
        }
    });

    // 4. Fetch Count (To fix pagination buttons)
    const { data: countData = { count: 0 } } = useQuery({
        queryKey: ['mealsCount', search],
        queryFn: async () => {
            const res = await axios.get(`https://foodmate-server-v2.vercel.app/mealsCount?search=${search}`);
            return res.data;
        }
    });

    const numberOfPages = Math.ceil(countData.count / itemsPerPage);
    const pages = [...Array(numberOfPages).keys()];

    // Handle Search Submit (Clicking Button or Pressing Enter)
    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchText); // This triggers the Server Call
        setCurrentPage(0); // Reset to Page 1
    };

    return (
        <div className="pt-24 px-4 max-w-screen-xl mx-auto pb-20">
            <h2 className="text-4xl font-bold text-center mb-4 text-orange-500">All Meals</h2>
            <p className="text-center text-gray-500 mb-10">Browse our complete menu</p>

            {/* --- SEARCH BAR --- */}
            <div className="flex justify-center mb-10">
                <form onSubmit={handleSearch} className="join w-full max-w-md">
                    <input 
                        className="input input-bordered join-item w-full border-orange-400 focus:outline-none" 
                        placeholder="Search for Dal, Pizza, Burger..." 
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                    />
                    <button type="submit" className="btn join-item bg-orange-500 border-orange-500 text-white hover:bg-orange-600">
                        <FaSearch className="text-lg"/>
                    </button>
                </form>
            </div>

            {/* --- LOADING STATE --- */}
            {isLoading ? (
                <div className="flex justify-center h-40">
                    <span className="loading loading-spinner loading-lg text-orange-500"></span>
                </div>
            ) : (
                <>
                    {/* --- NO RESULTS FOUND --- */}
                    {meals.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-bold text-gray-400">No meals found for "{search}".</h3>
                            <button onClick={() => {setSearch(''); setSearchText('')}} className="btn btn-link text-orange-500">
                                Clear Search
                            </button>
                        </div>
                    ) : (
                        /* --- MEALS GRID --- */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {meals.map(item => (
                                <div key={item._id} className="card bg-base-100 shadow-xl border hover:border-orange-400 transition-all">
                                    <figure className="h-60 overflow-hidden">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                    </figure>
                                    <div className="card-body">
                                        <h2 className="card-title justify-between">
                                            {item.title}
                                            <div className="badge badge-secondary bg-orange-500 border-none text-white">${item.price}</div>
                                        </h2>
                                        <p className="text-gray-500 line-clamp-2">{item.description}</p>
                                        <div className="card-actions justify-end mt-4">
                                            <Link to={`/meals/${item._id}`}>
                                                <button className="btn btn-primary bg-gradient-to-r from-orange-500 to-pink-500 border-none text-white btn-sm px-6">
                                                    View Details
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* --- PAGINATION BUTTONS --- */}
            {meals.length > 0 && (
                <div className="flex justify-center mt-12 gap-2">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} 
                        className="btn btn-sm btn-outline"
                        disabled={currentPage === 0}
                    >
                        « Previous
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
                        Next »
                    </button>
                </div>
            )}
        </div>
    );
};

export default Meals;
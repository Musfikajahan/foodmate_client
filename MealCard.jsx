import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const MealCard = ({ meal }) => {
    const { _id, title, image, price, rating, category, chefName } = meal;

    return (
        <div className="card w-96 bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
            <figure className="h-60 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </figure>

            <div className="card-body">
                <div className="flex justify-between items-center">
                    <div className="badge badge-secondary badge-outline">{category}</div>
                    <div className="flex items-center text-yellow-500 font-bold gap-1">
                        <FaStar /> {rating}
                    </div>
                </div>

                <h2 className="card-title text-2xl font-bold text-gray-800">{title}</h2>
                <p className="text-gray-500 text-sm">Chef: {chefName}</p>

                <div className="card-actions justify-between items-center mt-4">
                    <p className="text-xl font-bold text-chef-primary">${price}</p>

                    {/* FIXED LINK */}
                    <Link
                        to={`/meals/${_id}`}
                        className="btn btn-sm bg-chef-dark text-white hover:bg-chef-primary border-none"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MealCard;

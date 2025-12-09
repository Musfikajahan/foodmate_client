import { Link } from "react-router-dom";

const Banner = () => {
    return (
        <div className="hero min-h-[600px]" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)'}}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold text-white">Taste the <span className="text-chef-primary">Magic</span></h1>
                    <p className="mb-5 text-gray-200">Order fresh, home-cooked meals from the best local chefs in your area. Healthy, affordable, and delivered hot.</p>
                    <Link to="/meals" className="btn btn-primary bg-chef-primary border-none text-white hover:bg-orange-600">Order Now</Link>
                </div>
            </div>
        </div>
    );
};

export default Banner;
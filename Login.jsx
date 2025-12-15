import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { motion } from "framer-motion";

const Login = () => {
    const { signIn, googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        signIn(data.email, data.password)
            .then(result => {
                Swal.fire({
                    title: 'Success!',
                    text: 'User Login Successful',
                    icon: 'success',
                    confirmButtonText: 'Cool'
                });
                navigate(from, { replace: true });
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: error.message,
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            });
    }

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                navigate(from, { replace: true });
            });
    }

    return (
        <div className="hero min-h-screen bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100">
            <motion.div 
                className="hero-content flex-col lg:flex-row-reverse"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                {/* Left Content */}
                <div className="text-center lg:text-left mb-10 lg:mb-0">
                    <motion.h1 
                        className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        Login now!
                    </motion.h1>
                    <motion.p
                        className="py-6 text-gray-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    >
                        Welcome back to FoodChef. Please login to manage your orders.
                    </motion.p>
                </div>

                {/* Right Form */}
                <motion.div
                    className="card shrink-0 w-full max-w-sm shadow-2xl bg-white rounded-3xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Email</span>
                            </label>
                            <input 
                                type="email" 
                                {...register("email", { required: true })} 
                                placeholder="Email" 
                                className="input input-bordered focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300" 
                            />
                            {errors.email && <span className="text-red-600 text-sm mt-1">Email is required</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Password</span>
                            </label>
                            <input 
                                type="password" 
                                {...register("password", { required: true })} 
                                placeholder="Password" 
                                className="input input-bordered focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300" 
                            />
                            {errors.password && <span className="text-red-600 text-sm mt-1">Password is required</span>}
                        </div>

                        <div className="form-control mt-4">
                            <motion.input 
                                className="btn bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-bold border-none shadow-lg hover:scale-105 transition-transform duration-300"
                                type="submit" 
                                value="Login" 
                                whileHover={{ scale: 1.05 }}
                            />
                        </div>

                        <div className="divider">OR</div>

                        <motion.button 
                            type="button" 
                            onClick={handleGoogleSignIn} 
                            className="btn btn-outline border-pink-400 text-pink-500 hover:bg-pink-100 hover:text-pink-700 transition-all duration-300 w-full"
                            whileHover={{ scale: 1.03 }}
                        >
                            Login with Google
                        </motion.button>
                    </form>

                    <p className="p-4 text-center text-gray-600">
                        New here? <Link to="/register" className="text-pink-500 font-bold hover:underline transition duration-300">Create an account</Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;

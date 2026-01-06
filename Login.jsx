import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { motion } from "framer-motion";
import axios from "axios";

const Login = () => {
    const { signIn, googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleLoginSuccess = (user) => {
        // 1. Attempt to generate JWT Token
        axios.post('https://foodmate-server-v2.vercel.app/jwt', { email: user.email })
            .then(data => {
                localStorage.setItem('access-token', data.data.token);
                // Success: Navigate
                navigate(from, { replace: true });
            })
            .catch(err => {
                console.error("JWT Error:", err);
                // Error: Navigate anyway so user isn't stuck
                navigate(from, { replace: true });
            });
    }

    const onSubmit = data => {
        signIn(data.email, data.password)
            .then(result => {
                Swal.fire({
                    title: 'Login Successful!',
                    text: 'Welcome back!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                // Call the helper function to handle token & navigation
                handleLoginSuccess(result.user);
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: error.message,
                    icon: 'error',
                });
            });
    }

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                const userInfo = {
                    email: result.user.email,
                    name: result.user.displayName,
                    role: 'user',
                    status: 'active'
                }
                axios.post('https://foodmate-server-v2.vercel.app/users', userInfo)
                    .then(() => {
                         handleLoginSuccess(result.user);
                    })
                    .catch(() => {
                        // Even if saving user to DB fails, let them in
                        handleLoginSuccess(result.user);
                    });
            });
    }

    return (
        <div className="hero min-h-screen bg-gradient-to-r from-orange-50 to-pink-50">
            <motion.div 
                className="hero-content flex-col lg:flex-row-reverse"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold text-orange-600 mb-4">Login now!</h1>
                    <p className="py-6 text-gray-600">Welcome back to FoodMate. Please login to continue.</p>
                </div>
                <motion.div 
                    className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-white"
                    whileHover={{ y: -5 }}
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <input type="email" {...register("email", { required: true })} placeholder="email" className="input input-bordered" />
                            {errors.email && <span className="text-red-600">Email is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input type="password" {...register("password", { required: true })} placeholder="password" className="input input-bordered" />
                            {errors.password && <span className="text-red-600">Password is required</span>}
                        </div>
                        <div className="form-control mt-6">
                            <input type="submit" value="Login" className="btn btn-primary bg-orange-500 border-none text-white" />
                        </div>
                        <div className="divider">OR</div>
                        <button type="button" onClick={handleGoogleSignIn} className="btn btn-outline btn-accent">Login with Google</button>
                    </form>
                    <p className="text-center mb-4"><Link to="/register" className="text-orange-600 font-bold">Create an account</Link></p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
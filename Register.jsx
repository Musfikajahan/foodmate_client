import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import axios from "axios";
import { motion } from "framer-motion";

const Register = () => {
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = data => {
        createUser(data.email, data.password)
            .then(result => {
                updateUserProfile(data.name, data.photoURL)
                    .then(() => {
                        const userInfo = { name: data.name, email: data.email, role: 'user', image: data.photoURL };
                        axios.post('https://server-vert-rho.vercel.app/users', userInfo)
                            .then(res => {
                                if (res.data.insertedId) {
                                    reset();
                                    Swal.fire({
                                        position: 'top-end',
                                        icon: 'success',
                                        title: 'User created successfully!',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                }
                                navigate('/');
                            })
                            .catch(() => navigate('/'));
                    })
                    .catch(() => navigate('/'));
            })
            .catch(error => Swal.fire({ icon: 'error', title: 'Registration Failed', text: error.message }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-100 to-green-50 p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
                className="max-w-4xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-8"
            >
                {/* Text Section */}
                <motion.div 
                    initial={{ x: -50, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    transition={{ duration: 0.6 }}
                    className="text-center lg:text-left"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold text-green-600 mb-4 drop-shadow-lg">
                        Sign Up!
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700">
                        Join our community of food lovers and chefs.
                    </p>
                </motion.div>

                {/* Form Section */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="card w-full max-w-md shadow-2xl bg-white rounded-3xl p-8 hover:shadow-3xl transition-shadow duration-500"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <input type="text" {...register("name", { required: true })} placeholder="Name" className="input input-bordered w-full focus:ring-2 focus:ring-green-400 transition-all duration-300" />
                        <input type="text" {...register("photoURL", { required: true })} placeholder="Photo URL" className="input input-bordered w-full focus:ring-2 focus:ring-green-400 transition-all duration-300" />
                        <input type="email" {...register("email", { required: true })} placeholder="Email" className="input input-bordered w-full focus:ring-2 focus:ring-green-400 transition-all duration-300" />
                        <input type="password" {...register("password", { required: true, minLength: 6 })} placeholder="Password" className="input input-bordered w-full focus:ring-2 focus:ring-green-400 transition-all duration-300" />
                        {errors.password?.type === 'minLength' && <span className="text-red-600 text-sm">Password must be at least 6 characters</span>}

                        <motion.input 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }} 
                            type="submit" 
                            value="Sign Up" 
                            className="btn btn-primary bg-green-500 border-none text-white py-3 text-lg rounded-xl shadow-lg transition-all duration-300"
                        />
                    </form>
                    <p className="text-center mt-4 text-gray-600">
                        Already have an account? <Link to="/login" className="text-green-600 font-bold hover:underline">Login</Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;

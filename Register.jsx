import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import axios from "axios";

const Register = () => {
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = data => {
        createUser(data.email, data.password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser);
                
                updateUserProfile(data.name, data.photoURL)
                    .then(() => {
                        const userInfo = {
                            name: data.name,
                            email: data.email,
                            role: 'user', // Default role
                            image: data.photoURL
                        }
                        
                        // Save user to database
                        axios.post('http://localhost:5000/users', userInfo)
                            .then(res => {
                                if (res.data.insertedId) {
                                    console.log('User added to database');
                                    reset();
                                    Swal.fire({
                                        position: 'top-end',
                                        icon: 'success',
                                        title: 'User created successfully.',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                }
                                // Navigate HOME regardless of database response
                                // (Because Firebase registration was successful)
                                navigate('/');
                            })
                            .catch(error => {
                                console.error("Database error:", error);
                                // Even if database fails, let them in
                                navigate('/'); 
                            });
                    })
                    .catch(error => {
                        console.error("Profile update error:", error);
                        navigate('/');
                    });
            })
            .catch(error => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: error.message,
                });
            });
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Sign Up!</h1>
                    <p className="py-6">Join our community of food lovers and chefs.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Name</span></label>
                            <input type="text" {...register("name", { required: true })} placeholder="Name" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Photo URL</span></label>
                            <input type="text" {...register("photoURL", { required: true })} placeholder="Photo URL" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <input type="email" {...register("email", { required: true })} placeholder="email" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input type="password" {...register("password", { required: true, minLength: 6 })} placeholder="password" className="input input-bordered" />
                            {errors.password?.type === 'minLength' && <span className="text-red-600">Password must be 6 characters</span>}
                        </div>
                        <div className="form-control mt-6">
                            <input className="btn btn-primary bg-chef-primary border-none text-white" type="submit" value="Sign Up" />
                        </div>
                    </form>
                    <p className="p-4 text-center"><small>Already have an account? <Link to="/login" className="text-chef-primary font-bold">Login</Link></small></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
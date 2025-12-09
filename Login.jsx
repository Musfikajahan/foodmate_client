import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';

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
            })
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Welcome back to FoodChef. Please login to manage your orders.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" {...register("email", { required: true })} placeholder="email" className="input input-bordered" />
                            {errors.email && <span className="text-red-600">Email is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" {...register("password", { required: true })} placeholder="password" className="input input-bordered" />
                        </div>
                        <div className="form-control mt-6">
                            <input className="btn btn-primary bg-chef-primary border-none text-white" type="submit" value="Login" />
                        </div>
                        <div className="divider">OR</div>
                        <button type="button" onClick={handleGoogleSignIn} className="btn btn-outline w-full">Google Sign In</button>
                    </form>
                    <p className="p-4 text-center"><small>New here? <Link to="/register" className="text-chef-primary font-bold">Create an account</Link></small></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
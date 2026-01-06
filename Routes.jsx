import { createBrowserRouter, Navigate } from "react-router-dom";
import Main from "../layout/Main";
import Dashboard from "../layout/Dashboard";
import Home from "../pages/Home";
import Meals from "../pages/Meals";
import MealDetails from "../pages/MealDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Order from "../pages/Order";
import MyOrders from "../pages/MyOrders";
import AllUsers from "../pages/AllUsers";
import UserProfile from "../pages/UserProfile";
import AdminHome from "../pages/AdminHome";
import AddMeal from "../pages/AddMeal";
import MyMeals from "../pages/MyMeals";
import OrderRequests from "../pages/OrderRequests";
import PrivateRoute from "./PrivateRoute";
import Payment from "../pages/Payment/Payment";
import PaymentHistory from "../pages/PaymentHistory";
import PaymentSuccess from "../pages/PaymentSuccess";
import AdminPaymentHistory from "../pages/AdminPaymentHistory";
import ManageRequests from "../pages/ManageRequests";
import MyProfile from "../pages/MyProfile";
import EditProfile from "../pages/EditProfile";
import MyReviews from "../pages/MyReviews";
import ManageItems from "../pages/Dashboard/ManageItems/ManageItems";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        children: [
            { path: "/", element: <Home></Home> },
            { path: "meals", element: <Meals></Meals> },
            { 
                path: "meals/:id", 
                element: <PrivateRoute><MealDetails></MealDetails></PrivateRoute>,
                loader: ({params}) => fetch(`https://foodmate-server-v2.vercel.app/meals/${params.id}`)
            },
            { path: "order", element: <Order></Order> },
            { path: "login", element: <Login></Login> },
            { path: "register", element: <Register></Register> }
        ]
    },
    {
        path: "dashboard",
        element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
        children: [
            { index: true, element: <Navigate to="/dashboard/my-profile" replace /> },

            // User Routes
            { path: "my-orders", element: <MyOrders></MyOrders> },
            { path: "my-profile", element: <MyProfile></MyProfile> },
            { path: "my-reviews", element: <MyReviews></MyReviews> }, 
            
            // Admin Routes
            { path: "all-users", element: <AllUsers></AllUsers> },
            { path: "manage-requests", element: <ManageRequests></ManageRequests> },
            { path: "admin-home", element: <AdminHome></AdminHome> },
            { path: "admin-payment-history", element: <AdminPaymentHistory></AdminPaymentHistory> },
            { path: "manage-items", element: <ManageItems></ManageItems> },

            // Chef Routes
            { path: "add-meal", element: <AddMeal></AddMeal> },
            { path: "chef-home", element: <MyMeals></MyMeals> },
            { path: 'order-requests', element: <OrderRequests></OrderRequests> },
            {
                // ✅ Update Meal Route with Loader
                path: 'update-meal/:id',
                element: <AddMeal></AddMeal>, 
                // ✅ Fetch single meal data for editing
                loader: ({params}) => fetch(`https://foodmate-server-v2.vercel.app/meals/${params.id}`)
            },
            
            // Shared/Misc
            {
                path: 'payment/:id',
                element: <Payment></Payment>,
                loader: ({ params }) => fetch(`https://foodmate-server-v2.vercel.app/orders/${params.id}`)
            },
            { path: 'payment-history', element: <PaymentHistory></PaymentHistory> },
            { path: 'payment-success', element: <PaymentSuccess></PaymentSuccess> },
            { path: 'edit-profile', element: <EditProfile></EditProfile> },
        ]
    }
]);
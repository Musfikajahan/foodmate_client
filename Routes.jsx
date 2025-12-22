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
import OrderRequests from "../pages/OrderRequests"; // Correct Import
import PrivateRoute from "./PrivateRoute";
import Payment from "../pages/Payment/Payment"; // Import at top
import PaymentHistory from "../pages/PaymentHistory"; // <--- ADD THIS IMPORT
import PaymentSuccess from "../pages/PaymentSuccess"; // <--- ADD THIS IMPORT
import AdminPaymentHistory from "../pages/AdminPaymentHistory";

// --- IMPORT YOUR HOOKS ---
import useAdmin from "../hooks/useAdmin";
import useChef from "../hooks/useChef";

// --- SMART COMPONENT WITH DEBUGGING ---
const DashboardHome = () => {
    const [isAdmin, isAdminLoading] = useAdmin();
    const [isChef, isChefLoading] = useChef();

    console.log("Checking Roles...");
    console.log("Is Admin?", isAdmin);
    console.log("Is Chef?", isChef);

    if (isAdminLoading || isChefLoading) {
        return <div className="flex justify-center mt-10"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (isAdmin) {
        return <Navigate to="/dashboard/admin-home" replace />;
    }

    if (isChef) {
        return <Navigate to="/dashboard/chef-home" replace />;
    }

    return <Navigate to="/dashboard/my-profile" replace />;
};

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
                loader: ({ params }) => fetch(`https://foodmate-server-v2.vercel.app/meals/${params.id}`)
            },
            { path: "login", element: <Login></Login> },
            { path: "register", element: <Register></Register> },
            {
                path: "order/:id",
                element: <PrivateRoute><Order></Order></PrivateRoute>,
                loader: ({ params }) => fetch(`https://foodmate-server-v2.vercel.app/meals/${params.id}`)
            },
        ],
    },

    // --- DASHBOARD ROUTES ---
    {
        path: "dashboard",
        element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
        children: [
            {
                index: true,
                element: <DashboardHome></DashboardHome>
            },
            { path: "my-orders", element: <MyOrders></MyOrders> },
            { path: "all-users", element: <AllUsers></AllUsers> },
            { path: "my-profile", element: <UserProfile></UserProfile> },
            { path: "admin-home", element: <AdminHome></AdminHome> },
            { path: "add-meal", element: <AddMeal></AddMeal> },
            { path: "chef-home", element: <MyMeals></MyMeals> },

            // --- CHEF ROUTE ---
            {
                path: 'order-requests', // This matches the link in your Dashboard Sidebar
                element: <OrderRequests></OrderRequests>
            },
            {
                path: 'payment/:id',
                element: <Payment></Payment>,
                // Fetch the specific order so we know how much to charge
                loader: ({ params }) => fetch(`https://foodmate-server-v2.vercel.app/orders/${params.id}`)
            },
            // Inside Dashboard Children
            {
                path: 'payment-history',
                element: <PaymentHistory></PaymentHistory>
            },
            {
                path: 'payment-success',
                element: <PaymentSuccess></PaymentSuccess>
            },
            // Inside the Dashboard children:
            {
                path: "admin-payment-history",
                element: <AdminPaymentHistory></AdminPaymentHistory>
            },
            // Removed the extra 'manage-orders' block because it was redundant and missing an import.
        ]
    }
]);
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Main = () => {
    return (
        <div>
            <Navbar></Navbar>
            {/*  doesn't cover it */}
            <div className="pt-24 min-h-[calc(100vh-68px)]">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Main;
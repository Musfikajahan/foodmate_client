import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const useAdmin = () => {
    const { user, loading } = useContext(AuthContext);

    const {
        data: isAdminData,
        isLoading: isAdminLoading
    } = useQuery({
        queryKey: ["isAdmin", user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axios.get(`https://foodmate-server-v2.vercel.app/users/admin/${user.email}`);
            return res.data.isAdmin; // Correct field name
        }
    });

    return [isAdminData, isAdminLoading];
};

export default useAdmin;

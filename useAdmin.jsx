import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const useAdmin = () => {
    const { user, loading } = useContext(AuthContext);

    const {
        data: isAdminData = false,
        isLoading: isAdminLoading
    } = useQuery({
        queryKey: ["isAdmin", user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const token = localStorage.getItem('access-token'); // 1. Get Token
            const res = await axios.get(
                `https://foodmate-server-v2.vercel.app/users/admin/${user.email}`,
                {
                    headers: {
                        authorization: `Bearer ${token}` // 2. Send Token
                    }
                }
            );
            return res.data.isAdmin;
        }
    });

    return [isAdminData, isAdminLoading];
};

export default useAdmin;
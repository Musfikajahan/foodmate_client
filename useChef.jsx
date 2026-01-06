import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const useChef = () => {
    const { user, loading } = useContext(AuthContext);

    const {
        data: isChef = false,
        isLoading: isChefLoading
    } = useQuery({
        queryKey: ["isChef", user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const token = localStorage.getItem('access-token'); // 1. Get Token
            const res = await axios.get(
                `https://foodmate-server-v2.vercel.app/users/chef/${user.email}`, 
                {
                    headers: {
                        authorization: `Bearer ${token}` // 2. Send Token
                    }
                }
            );
            return res.data.isChef;
        }
    });

    return [isChef, isChefLoading];
};

export default useChef;
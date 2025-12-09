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
            const res = await axios.get(
                `http://localhost:5000/users/chef/${user.email}`
            );
            return res.data.chef;
        }
    });

    return [isChef, isChefLoading];
};

export default useChef;

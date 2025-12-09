import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const useAdmin = () => {
    const { user, loading } = useContext(AuthContext);

    const {
        data: isAdmin = false,
        isLoading: isAdminLoading
    } = useQuery({
        queryKey: ["isAdmin", user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axios.get(
                `http://localhost:5000/users/admin/${user.email}`
            );
            return res.data.admin;
        }
    });

    return [isAdmin, isAdminLoading];
};

export default useAdmin;

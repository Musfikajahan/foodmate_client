import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://server-vert-rho.vercel.app'
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;
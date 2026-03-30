import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/Axios/axiosInstance";

const useHomepageData = (initialData) => {
    return useQuery({
        queryKey: ["homepageData"],
        queryFn: async () => {
            const response = await axiosInstance.get("/home/");
            return response.data;
        },
        initialData: initialData,
        staleTime: 5 * 60 * 1000,
    });
};

export default useHomepageData;

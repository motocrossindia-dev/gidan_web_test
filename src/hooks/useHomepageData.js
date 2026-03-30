import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/Axios/axiosInstance";

const useHomepageData = () => {
    return useQuery({
        queryKey: ["homepageData"],
        queryFn: async () => {
            const response = await axiosInstance.get("/home/");
            // Returning the full response object, which now contains a "sections" array
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export default useHomepageData;

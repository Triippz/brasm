import {useEffect, useState} from "react";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {DEFAULT_TIMEOUT, JWT_TOKEN} from "../config/constants";

export function useApi<T>(url: string, options?: AxiosRequestConfig) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const token = localStorage.getItem(JWT_TOKEN);
            const authHeader = token ? {'Authorization': `Bearer ${token}`} : {};
            const response: AxiosResponse<T> = await axios(
                url,
                {
                    ...options,
                    headers: {
                        ...options?.headers,
                        ...authHeader
                    },
                    timeout: DEFAULT_TIMEOUT
                }
            );
            setData(response.data);
        } catch (error: any) {
            setError(error);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return {data, isLoading, error};
}

export default useApi;

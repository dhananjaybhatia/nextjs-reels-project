import { IVideo } from "@/models/Video";
import axios, { AxiosRequestConfig } from "axios";

export type VideoFormData = Omit<IVideo, "_id">

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
};

class ApiClient {
    private async myFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
        const { method = "GET", body, headers = {} } = options;

        const config: AxiosRequestConfig = {
            method,
            url: `/api${endpoint}`,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            data: body, // axios will stringify JSON automatically
        };

        const response = await axios.request<T>(config);
        return response.data;
    }

    // Example usage wrapper
    public async get<T>(endpoint: string, headers?: Record<string, string>) {
        return this.myFetch<T>(endpoint, { method: "GET", headers });
    }

    public async post<T>(endpoint: string, body: any, headers?: Record<string, string>) {
        return this.myFetch<T>(endpoint, { method: "POST", body, headers });
    }
    public async getVideos<T>() {
        return this.get<T>("/videos");
    }
    public async getVideoById<T>(id: string) {
        return this.get<T>(`/videos/${id}`);
    }
    public async createVideo<T>(videoData: VideoFormData) {
        return this.post<T>("/videos", videoData);
    }
    public async put<T>(endpoint: string, body: any, headers?: Record<string, string>) {
        return this.myFetch<T>(endpoint, { method: "PUT", body, headers });
    }

    public async delete<T>(endpoint: string, headers?: Record<string, string>) {
        return this.myFetch<T>(endpoint, { method: "DELETE", headers });
    }


}

export const apiClient = new ApiClient();

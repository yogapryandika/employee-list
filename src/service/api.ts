import axios from "axios";
import type { BasicInfo, Details } from "../types/employee";

const apiStep1 = 'http://localhost:4001';
const apiStep2 = 'http://localhost:4002';

export const employeeService = {
    getAllBasicInfo: async () => {
        const response = await axios.get<BasicInfo[]>(`${apiStep1}/basicInfo`);
        return response.data;
    },

    getAllDetails: async () => {
        const response = await axios.get<Details[]>(`${apiStep2}/details`);
        return response.data;
    },

    getBasicInfoByDepartment: async (department: string) => {
        const response = await axios.get<BasicInfo[]>(`${apiStep1}/basicInfo?department=${encodeURIComponent(department)}`);
        return response.data;
    },

    createBasicInfo: async (data: BasicInfo) => {
        const response = await axios.post(`${apiStep1}/basicInfo`, data);
        return response.data;
    },

    createDetails: async (data: Details) => {
        const response = await axios.post(`${apiStep2}/details`, data);
        return response.data;
    },

    // Generic fetcher for autocomplete
    fetchSuggestions: async <T>(baseUrl: string, query: string) => {
        const response = await axios.get<T>(`${baseUrl}${encodeURIComponent(query)}`);
        return response.data;
    }
};

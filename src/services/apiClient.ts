import axios, { AxiosInstance } from "axios";

type RequestMethods = "get" | "post" | "patch" | "put" | "delete";

class TuitionMasterApiClient {
  private readonly client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private async makeRequest<T>({
    method,
    url,
    data,
  }: {
    method: RequestMethods;
    url: string;
    data?: any;
  }): Promise<T> {
    const response = await this.client.request({
      method,
      url,
      data,
    });
    return response.data as T;
  }

  // login api
  public async login(data: any): Promise<any> {
    return this.makeRequest<any>({
      method: "post",
      url: "/auth/login",
      data: data,
    });
  }

  // register school
  public async registerSchool(data: any): Promise<any> {
    return this.makeRequest<any>({
      method: "post",
      url: "/school-admin/schools",
      data: data,
    });
  }
}

const getEnvVar = (key: string, defaultValue: string): string => {
  try {
    const env = (import.meta as any).env;
    if (env && env[key]) {
      return env[key];
    }
  } catch {
    // Fallback
  }
  return defaultValue;
};

const API_BASE_URL = getEnvVar(
  "VITE_API_BASE_URL",
  "http://localhost:8000/api"
);

export default new TuitionMasterApiClient(API_BASE_URL);

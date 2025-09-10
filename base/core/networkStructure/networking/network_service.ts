import axios from "axios";
import type { AxiosResponse } from "axios";
import type { AxiosInstance } from "axios";
import HeaderHandler from "@/base/core/networkStructure/networking/utils/header_handler";
import type PostParams from "@/base/core/Params/post_params";
import type GetParams from "@/base/core/Params/get_params";
// Network service for HTTP requests
export default class NetworkService {
  private axiosInstance: AxiosInstance;
  private static _instance: NetworkService;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://jsonplaceholder.typicode.com",
    });
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new NetworkService();
    }
    return this._instance;
  }

  async post({
    url,
    data,
    headers,
    queryParams,
    isAuth = false,
  }: PostParams): Promise<AxiosResponse> {
    return this.axiosInstance.post(url, data, {
      headers: headers ? headers : HeaderHandler.Instance.getHeader(isAuth),
      params: queryParams,
    });
  }

  async postFormData({
    url,
    data,
    headers,
    queryParams,
    isAuth = false,
  }: PostParams): Promise<AxiosResponse> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (key === "image" && value instanceof File) {
          // Special handling for the "image" key
          formData.append(key, value); // Append the file directly
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item as string | Blob);
          });
        } else {
          formData.append(key, value as string | Blob);
        }
      }
    });

    return this.axiosInstance.post(url, formData, {
      headers: {
        ...headers ? headers : HeaderHandler.Instance.getHeader(isAuth),
        "Content-Type": "multipart/form-data",
      },
      params: queryParams,
    });
  }

  async get({
    url,
    headers,
    queryParams,
    isAuth = false,
  }: GetParams): Promise<AxiosResponse> {
    return this.axiosInstance.get(url, {
      headers: headers ?? HeaderHandler.Instance.getHeader(isAuth),
      params: queryParams,
    });
  }

  async delete({
    url,
    headers,
    queryParams,
    isAuth = false,
  }: GetParams): Promise<AxiosResponse> {
    return this.axiosInstance.delete(url, {
      headers: headers ?? HeaderHandler.Instance.getHeader(isAuth),
      params: queryParams,
    });
  }

  async put({
    url,
    data,
    headers,
    queryParams,
    isAuth = false,
  }: PostParams): Promise<AxiosResponse> {
    return this.axiosInstance.put(url, data, {
      headers: headers ?? HeaderHandler.Instance.getHeader(isAuth),
      params: queryParams,
    });
  }

  async patch({
    url,
    data,
    headers,
    queryParams,
    isAuth = false,
  }: PostParams): Promise<AxiosResponse> {
    return this.axiosInstance.patch(url, data, {
      headers: headers ?? HeaderHandler.Instance.getHeader(isAuth),
      params: queryParams,
    });
  }
}

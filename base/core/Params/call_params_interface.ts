import type Params from "@/base/core/Params/params";

export enum CrudType {
  POST = "post",
  GET = "get",
  FormData = "formData",
  DELETE = "delete",
  PUT = "put",
  PATCH = "patch",
}

export default interface ServiceCallParams {
  url: string;
  type: CrudType;
  auth?: boolean;
  forceRefresh?: boolean;
  showLoadingDialog?: boolean;
  headers?: Record<string, string>;
  params?: Params;
  details?: Record<string, any>;
}

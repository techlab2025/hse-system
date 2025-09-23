import { AddPermissionApiService } from "@/features/users/employee/Data/apiServices/add_permission_api_service";
import EmployeeModel from "@/features/users/employee/Data/models/index_employee_model";
import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";

class AddPermissionRepo extends RepoInterface<EmployeeModel> {
  private static instance: AddPermissionRepo;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPermissionRepo();
    }
    return this.instance;
  }

  onParse(data: any): EmployeeModel {
    return EmployeeModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return AddPermissionApiService.getInstance();
  }
}

export { AddPermissionRepo };

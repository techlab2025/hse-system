import EmployeeModel from "@/features/users/Admin/Data/models/index_employee_model";
import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";
import { UpdatePasswordEmployeeApiService } from "@/features/users/Admin/Data/apiServices/update_password_employee_api_service";

class UpdatePasswordEmployeeRepo extends RepoInterface<EmployeeModel> {
  private static instance: UpdatePasswordEmployeeRepo;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new UpdatePasswordEmployeeRepo();
    }
    return this.instance;
  }

  onParse(data: any): EmployeeModel {
    return EmployeeModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return UpdatePasswordEmployeeApiService.getInstance();
  }
}

export { UpdatePasswordEmployeeRepo };

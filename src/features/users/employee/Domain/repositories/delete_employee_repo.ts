import { DeleteEmployeeApiService } from "@/features/users/employee/Data/apiServices/delete_employee_api_service";
import EmployeeModel from "@/features/users/employee/Data/models/index_employee_model";
import RepoInterface, {
  ResponseType,
} from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";

class DeleteEmployeeRepo extends RepoInterface<EmployeeModel> {
  private static instance: DeleteEmployeeRepo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteEmployeeRepo();
    }
    return this.instance;
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData;
  }

  onParse(data: any): EmployeeModel {
    return EmployeeModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return DeleteEmployeeApiService.getInstance();
  }
}

export { DeleteEmployeeRepo };

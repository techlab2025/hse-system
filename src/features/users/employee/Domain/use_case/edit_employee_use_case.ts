import type Params from "@/base/core/params/params";
import type EmployeeModel from "@/features/dashboard/users/employee/Data/models/index_employee_model";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { EditEmployeeRepo } from "@/features/dashboard/users/employee/Domain/repositories/edit_employee_repo";

export default class EditEmployeeUseCase
  implements UseCase<EmployeeModel, Params>
{
  async call(params: Params): Promise<DataState<EmployeeModel>> {
    return EditEmployeeRepo.getInstance().call(params);
  }
}

import type Params from "@/base/core/params/params";
import type EmployeeModel from "@/features/dashboard/users/employee/Data/models/index_employee_model";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { AddPermissionRepo } from "@/features/dashboard/users/employee/Domain/repositories/add_permission_repo";

export default class AddPermissionUseCase
  implements UseCase<EmployeeModel, Params>
{
  async call(params: Params): Promise<DataState<EmployeeModel>> {
    return AddPermissionRepo.getInstance().call(params);
  }
}

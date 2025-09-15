import type Params from "@/base/core/params/params";
// import type ShowEmployeePermissionModel from "@/features/dashboard/users/employee/Data/models/show_employee_model";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { ShowEmployeePermissionRepo } from "@/features/dashboard/users/employee/Domain/repositories/show_permission_repo";
import PermissionModel from "@/features/dashboard/users/employee/Data/models/permission_model";

export default class ShowEmployeePermissionUseCase
  implements UseCase<PermissionModel, Params>
{
  async call(params: Params): Promise<DataState<PermissionModel>> {
    return ShowEmployeePermissionRepo.getInstance().call(params);
  }
}

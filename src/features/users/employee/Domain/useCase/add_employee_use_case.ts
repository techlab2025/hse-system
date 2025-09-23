import type Params from "@/base/core/params/params";
import type EmployeeModel from "@/features/users/employee/Data/models/index_employee_model";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { AddEmployeeRepo } from "@/features/users/employee/Domain/repositories/add_employee_repo";

export default class AddEmployeeUseCase
  implements UseCase<EmployeeModel, Params>
{
  async call(params: Params): Promise<DataState<EmployeeModel>> {
    return AddEmployeeRepo.getInstance().call(params);
  }
}

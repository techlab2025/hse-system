import type Params from "@/base/core/params/params";
import type ShowEmployeeModel from "@/features/users/employee/Data/models/show_employee_model";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { ShowEmployeeRepo } from "@/features/users/employee/Domain/repositories/show_employee_repo";

export default class ShowEmployeeUseCase
  implements UseCase<ShowEmployeeModel, Params>
{
  async call(params: Params): Promise<DataState<ShowEmployeeModel>> {
    return ShowEmployeeRepo.getInstance().call(params);
  }
}

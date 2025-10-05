import type Params from "@/base/core/params/params";
import type EmployeeModel from "@/features/users/Admin/Data/models/index_employee_model";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexEmployeeRepo } from "@/features/users/Admin/Domain/repositories/index_employee_repo";

export default class IndexEmployeeUseCase
  implements UseCase<EmployeeModel[], Params>
{
  async call(params: Params): Promise<DataState<EmployeeModel[]>> {
    return IndexEmployeeRepo.getInstance().call(params);
  }
}

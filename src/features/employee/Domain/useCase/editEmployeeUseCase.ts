import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type EmployeeModel from '../../Data/models/equipmentModel'
import { EditEmployeeRepo } from '../repositories/editEmployeeRepo'

export default class EditEmployeeUseCase implements UseCase<EmployeeModel, Params> {
  async call(params: Params): Promise<DataState<EmployeeModel>> {
    return EditEmployeeRepo.getInstance().call(params)
  }
}

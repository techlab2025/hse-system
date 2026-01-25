import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type EmployeeModel from '../../Data/models/equipmentModel'
import { AddEmployeeRepo } from '../repositories/addEmployeeRepo'

export default class AddEmployeeUseCase implements UseCase<EmployeeModel, Params> {
  async call(params: Params): Promise<DataState<EmployeeModel>> {
    return AddEmployeeRepo.getInstance().call(params)
  }
}

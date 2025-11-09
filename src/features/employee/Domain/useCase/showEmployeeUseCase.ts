import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type EmployeeDetailsModel from '../../Data/models/equipmentDetailsModel'
import { ShowEmployeeRepo } from '../repositories/showEmployeeRepo'

export default class ShowEmployeeUseCase implements UseCase<EmployeeDetailsModel, Params> {
  async call(params: Params): Promise<DataState<EmployeeDetailsModel>> {
    return ShowEmployeeRepo.getInstance().call(params)
  }
}

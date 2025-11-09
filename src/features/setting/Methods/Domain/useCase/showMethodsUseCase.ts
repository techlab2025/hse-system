import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type MethodsDetailsModel from '../../Data/models/MethodsDetailsModel'
import { ShowMethodsRepo } from '../repositories/showMethodsRepo'


export default class ShowMethodsUseCase
  implements UseCase<MethodsDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<MethodsDetailsModel>> {
    return ShowMethodsRepo.getInstance().call(params)
  }
}

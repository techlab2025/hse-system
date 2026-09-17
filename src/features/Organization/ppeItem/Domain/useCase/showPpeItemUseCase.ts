import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowPpeItemRepo } from '../repositories/showPpeItemRepo'
import PpeItemDetailsModel from '../../Data/models/PpeItemDetailsModel'

export default class ShowPpeItemUseCase
  implements UseCase<PpeItemDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<PpeItemDetailsModel>> {
    return ShowPpeItemRepo.getInstance().call(params)
  }
}

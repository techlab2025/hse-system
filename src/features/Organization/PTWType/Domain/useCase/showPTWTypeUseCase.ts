import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowPTWTypeRepo } from '../repositories/showPTWTypeRepo'
import PTWTypeDetailsModel from '../../Data/models/PTWTypeDetailsModel'

export default class ShowPTWTypeUseCase
  implements UseCase<PTWTypeDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<PTWTypeDetailsModel>> {
    return ShowPTWTypeRepo.getInstance().call(params)
  }
}

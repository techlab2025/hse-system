import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowDrillTypeRepo } from '../repositories/showDrillTypeRepo'
import DrillTypeDetailsModel from '../../Data/models/DrillTypeDetailsModel'

export default class ShowDrillTypeUseCase
  implements UseCase<DrillTypeDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<DrillTypeDetailsModel>> {
    return ShowDrillTypeRepo.getInstance().call(params)
  }
}

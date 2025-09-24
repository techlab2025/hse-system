import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowHazardTypeRepo } from '@/features/setting/HazardType/Domain/repositories/showHazardTypeRepo'
import HazardTypeDetailsModel from '@/features/setting/HazardType/Data/models/hazardTypeDetailsModel'

export default class ShowHazardTypeUseCase
  implements UseCase<HazardTypeDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<HazardTypeDetailsModel>> {
    return ShowHazardTypeRepo.getInstance().call(params)
  }
}

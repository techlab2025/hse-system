import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type LocationDetailsModel from '../../Data/models/LocationDetailsModel'
import { ShowLocationRepo } from '../repositories/showLocationRepo'

export default class ShowLocationUseCase
  implements UseCase<LocationDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<LocationDetailsModel>> {
    return ShowLocationRepo.getInstance().call(params)
  }
}

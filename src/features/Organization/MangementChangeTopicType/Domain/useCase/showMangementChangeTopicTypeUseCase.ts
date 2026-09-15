import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowMangementChangeTopicTypeRepo } from '../repositories/showMangementChangeTopicTypeRepo'
import type MangementChangeTopicTypeDetailsModel from '../../Data/models/MangementChangeTopicTypeDetailsModel'

export default class ShowMangementChangeTopicTypeUseCase
  implements UseCase<MangementChangeTopicTypeDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<MangementChangeTopicTypeDetailsModel>> {
    return ShowMangementChangeTopicTypeRepo.getInstance().call(params)
  }
}

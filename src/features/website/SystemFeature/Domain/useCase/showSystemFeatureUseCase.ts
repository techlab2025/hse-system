import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemFeatureDetailsModel from '../../Data/models/SystemFeatureDetailsModel'
import { ShowSystemFeatureRepo } from '../repositories/showSystemFeatureRepo'

export default class ShowSystemFeatureUseCase
  implements UseCase<SystemFeatureDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<SystemFeatureDetailsModel>> {
    return ShowSystemFeatureRepo.getInstance().call(params)
  }
}

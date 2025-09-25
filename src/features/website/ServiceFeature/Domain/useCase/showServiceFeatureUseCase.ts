import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowServiceFeatureRepo } from '../repositories/showServiceFeatureRepo'
import type ServiceFeatureDetailsModel from '../../Data/models/ServiceDetailsFeatureModel'

export default class ShowServiceFeatureUseCase
  implements UseCase<ServiceFeatureDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<ServiceFeatureDetailsModel>> {
    return ShowServiceFeatureRepo.getInstance().call(params)
  }
}

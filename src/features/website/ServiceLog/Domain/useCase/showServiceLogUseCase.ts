import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ServiceLogDetailsModel from '../../Data/models/ServiceDetailsLogModel'
import { ShowServiceLogRepo } from '../repositories/showServiceLogRepo'

export default class ShowServiceLogUseCase
  implements UseCase<ServiceLogDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<ServiceLogDetailsModel>> {
    return ShowServiceLogRepo.getInstance().call(params)
  }
}

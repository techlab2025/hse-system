import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ServiceDetailsModel from '../../Data/models/ServiceDetailsModel'
import { ShowServiceRepo } from '../repositories/showServiceRepo'



export default class ShowServiceUseCase
  implements UseCase<ServiceDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ServiceDetailsModel>> {
    return ShowServiceRepo.getInstance().call(params)
  }
}

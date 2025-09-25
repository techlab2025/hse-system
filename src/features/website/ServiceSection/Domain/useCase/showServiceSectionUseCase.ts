import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ServiceSectionDetailsModel from '../../Data/models/ServiceDetailsSectionModel'
import { ShowServiceSectionRepo } from '../repositories/showServiceSectionRepo'

export default class ShowServiceSectionUseCase
  implements UseCase<ServiceSectionDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<ServiceSectionDetailsModel>> {
    return ShowServiceSectionRepo.getInstance().call(params)
  }
}

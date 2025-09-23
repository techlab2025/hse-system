import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type AccidentsTypeDetailsModel from '../../Data/models/OrganizationDetailsModel'
import { ShowAccidentsTypeRepo } from '../repositories/showOrganizationRepo'

export default class ShowAccidentsTypeUseCase
  implements UseCase<AccidentsTypeDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<AccidentsTypeDetailsModel>> {
    return ShowAccidentsTypeRepo.getInstance().call(params)
  }
}

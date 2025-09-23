import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizationDetailsModel from '../../Data/models/OrganizationDetailsModel'
import { ShowOrganizationRepo } from '../repositories/showOrganizationRepo'

export default class ShowOrganizationUseCase
  implements UseCase<OrganizationDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<OrganizationDetailsModel>> {
    return ShowOrganizationRepo.getInstance().call(params)
  }
}

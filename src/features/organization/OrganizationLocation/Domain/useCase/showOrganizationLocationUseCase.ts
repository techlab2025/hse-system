import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizationLocationDetailsModel from '../../Data/models/OrganizationLocationDetailsModel'
import { ShowOrganizationLocationRepo } from '../repositories/showOrganizationLocationRepo'


export default class ShowOrganizationLocationUseCase
  implements UseCase<OrganizationLocationDetailsModel, Params> {
  async call(params: Params): Promise<DataState<OrganizationLocationDetailsModel>> {
    return ShowOrganizationLocationRepo.getInstance().call(params)
  }
}

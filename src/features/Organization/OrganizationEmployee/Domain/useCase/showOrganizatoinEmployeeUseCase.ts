import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizatoinEmployeeDetailsModel from '../../Data/models/OrganizatoinEmployeeDetailsModel'
import { ShowOrganizatoinEmployeeRepo } from '../repositories/showOrganizatoinEmployeeRepo'

export default class ShowOrganizatoinEmployeeUseCase
  implements UseCase<OrganizatoinEmployeeDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<OrganizatoinEmployeeDetailsModel>> {
    return ShowOrganizatoinEmployeeRepo.getInstance().call(params)
  }
}

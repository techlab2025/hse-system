import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizationDocumentsDetailsModel from '../../Data/models/OrganizationDocumentsDetailsModel'
import { ShowOrganizationDocumentsRepo } from '../repositories/showOrganizationDocumentsRepo'

export default class ShowOrganizationDocumentsUseCase
  implements UseCase<OrganizationDocumentsDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<OrganizationDocumentsDetailsModel>> {
    return ShowOrganizationDocumentsRepo.getInstance().call(params)
  }
}

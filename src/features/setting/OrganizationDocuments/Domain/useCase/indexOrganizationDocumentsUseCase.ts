import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizationDocumentsModel from '../../Data/models/OrganizationDocumentsModel'
import { IndexOrganizationDocumentsRepo } from '../repositories/indexOrganizationDocumentsRepo'

export default class IndexOrganizationDocumentsUseCase
  implements UseCase<OrganizationDocumentsModel[], Params>
{
  async call(params: Params): Promise<DataState<OrganizationDocumentsModel[]>> {
    return IndexOrganizationDocumentsRepo.getInstance().call(params)
  }
}

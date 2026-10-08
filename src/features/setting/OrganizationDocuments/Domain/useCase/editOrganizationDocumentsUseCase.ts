import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizationDocumentsModel from '../../Data/models/OrganizationDocumentsModel'
import { EditOrganizationDocumentsRepo } from '../repositories/editOrganizationDocumentsRepo'

export default class EditOrganizationDocumentsUseCase
  implements UseCase<OrganizationDocumentsModel, Params>
{
  async call(params: Params): Promise<DataState<OrganizationDocumentsModel>> {
    return EditOrganizationDocumentsRepo.getInstance().call(params)
  }
}

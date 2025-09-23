import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizationModel from '../../Data/models/OrganizationModel'
import { DeleteOrganizationRepo } from '../repositories/deleteOrganizationRepo'

export default class DeleteOrganizationUseCase implements UseCase<OrganizationModel, Params> {
  async call(params: Params): Promise<DataState<OrganizationModel>> {
    return DeleteOrganizationRepo.getInstance().call(params)
  }
}

import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteOrganizationLocationRepo } from '../repositories/deleteOrganizationLocationRepo'
import type OrganizationLocationModel from '../../Data/models/OrganizationLocationModel'



export default class DeleteOrganizationLocationUseCase implements UseCase<OrganizationLocationModel, Params> {
  async call(params: Params): Promise<DataState<OrganizationLocationModel>> {
    return DeleteOrganizationLocationRepo.getInstance().call(params)
  }
}

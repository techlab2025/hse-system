import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel'
import { DeleteOrganizationEmployeeRepo } from '../repositories/deleteOrganizatoinEmployeeRepo'

export default class DeleteOrganizatoinEmployeeUseCase implements UseCase<OrganizatoinEmployeeModel, Params> {
  async call(params: Params): Promise<DataState<OrganizatoinEmployeeModel>> {
    return DeleteOrganizationEmployeeRepo.getInstance().call(params)
  }
}

import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type AccidentsTypeModel from '../../Data/models/OrganizationModel'
import { DeleteAccidentsTypeRepo } from '../repositories/deleteOrganizationRepo'

export default class DeleteAccidentsTypeUseCase implements UseCase<AccidentsTypeModel, Params> {
  async call(params: Params): Promise<DataState<AccidentsTypeModel>> {
    return DeleteAccidentsTypeRepo.getInstance().call(params)
  }
}

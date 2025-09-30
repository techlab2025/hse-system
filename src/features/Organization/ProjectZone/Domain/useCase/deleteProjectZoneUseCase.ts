import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectZoneModel from '../../Data/models/ProjectZoneModel'
import { DeleteProjectZoneRepo } from '../repositories/deleteProjectZoneRepo'




export default class DeleteProjectZoneUseCase implements UseCase<ProjectZoneModel, Params> {
  async call(params: Params): Promise<DataState<ProjectZoneModel>> {
    return DeleteProjectZoneRepo.getInstance().call(params)
  }
}

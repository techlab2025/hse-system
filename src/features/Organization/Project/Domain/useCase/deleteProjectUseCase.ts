import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectModel from '../../Data/models/ProjectModel'
import { DeleteProjectRepo } from '../repositories/deleteProjectRepo'

export default class DeleteProjectUseCase implements UseCase<ProjectModel, Params> {
  async call(params: Params): Promise<DataState<ProjectModel>> {
    return DeleteProjectRepo.getInstance().call(params)
  }
}

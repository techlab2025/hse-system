import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectModel from '../../Data/models/ProjectModel'
import { DeleteProjectLocationTeamEmployeeRepo } from '../repositories/DeleteProjectLocationTeamEmployeeRepo'

export default class DeleteProjectLocationTeamEmployeeUseCase implements UseCase<ProjectModel, Params> {
  async call(params: Params): Promise<DataState<ProjectModel>> {
    return DeleteProjectLocationTeamEmployeeRepo.getInstance().call(params)
  }
}

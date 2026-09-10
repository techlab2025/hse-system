import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectFlowDetailsModel from '../../../Data/models/UpdatedProjectFlow/ProjectFlowDetailsModel'
import { ProjectFlowDetailsRepo } from '../../repositories/UpdatedProjectFlow/ProjectFlowDetailsRepo'

export default class ProjectFlowDetailsUseCase implements UseCase<ProjectFlowDetailsModel, Params> {
  call(params: Params): Promise<DataState<ProjectFlowDetailsModel>> {
    return ProjectFlowDetailsRepo.getInstance().call(params)
  }
}

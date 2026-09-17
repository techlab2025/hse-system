import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectFlowResponseModel from '../../../Data/models/UpdatedProjectFlow/ProjectFlowResponseModel'
import type ProjectFlowDetailsModel from '../../../Data/models/UpdatedProjectFlow/ProjectFlowDetailsModel'
import {
  BasicProjectRepo,
  ProjectEquipmentsRepo,
  ProjectHolidaysRepo,
  ProjectLocationPositionEmployeesRepo,
  ProjectTeamsRepo,
  ProjectFlowDetailsRepo,
} from '../../repositories/UpdatedProjectFlow/ProjectFlowRepositories'

abstract class ProjectFlowUseCase implements UseCase<ProjectFlowResponseModel, Params> {
  protected abstract repo: { call(params: Params): Promise<DataState<ProjectFlowResponseModel>> }
  call(params: Params): Promise<DataState<ProjectFlowResponseModel>> { return this.repo.call(params) }
}

export class BasicProjectUseCase extends ProjectFlowUseCase { protected repo = new BasicProjectRepo() }
export class ProjectHolidaysUseCase extends ProjectFlowUseCase { protected repo = new ProjectHolidaysRepo() }
export class ProjectLocationPositionEmployeesUseCase extends ProjectFlowUseCase { protected repo = new ProjectLocationPositionEmployeesRepo() }
export class ProjectTeamsUseCase extends ProjectFlowUseCase { protected repo = new ProjectTeamsRepo() }
export class ProjectEquipmentsUseCase extends ProjectFlowUseCase { protected repo = new ProjectEquipmentsRepo() }
export class ProjectFlowDetailsUseCase implements UseCase<ProjectFlowDetailsModel, Params> {
  call(params: Params): Promise<DataState<ProjectFlowDetailsModel>> { return new ProjectFlowDetailsRepo().call(params) }
}

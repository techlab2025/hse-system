import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectFlowResponseModel from '../../../Data/models/UpdatedProjectFlow/ProjectFlowResponseModel'
import type ProjectFlowDetailsModel from '../../../Data/models/UpdatedProjectFlow/ProjectFlowDetailsModel'
import {
  BasicProjectUseCase,
  ProjectEquipmentsUseCase,
  ProjectHolidaysUseCase,
  ProjectLocationPositionEmployeesUseCase,
  ProjectTeamsUseCase,
  ProjectFlowDetailsUseCase,
} from '../../../Domain/useCase/UpdatedProjectFlow/ProjectFlowUseCases'

abstract class ProjectFlowController extends ControllerInterface<ProjectFlowResponseModel> {
  protected abstract useCase: { call(params: Params): Promise<DataState<ProjectFlowResponseModel>> }

  async save(params: Params) {
    this.setLoading()
    const state = await this.useCase.call(params)
    this.setState(state)
    this.handleResponseDialogs()
    return state
  }
}

export class BasicProjectController extends ProjectFlowController { constructor() { super() } protected useCase = new BasicProjectUseCase() }
export class ProjectHolidaysController extends ProjectFlowController { constructor() { super() } protected useCase = new ProjectHolidaysUseCase() }
export class ProjectLocationPositionEmployeesController extends ProjectFlowController { constructor() { super() } protected useCase = new ProjectLocationPositionEmployeesUseCase() }
export class ProjectTeamsController extends ProjectFlowController { constructor() { super() } protected useCase = new ProjectTeamsUseCase() }
export class ProjectEquipmentsController extends ProjectFlowController { constructor() { super() } protected useCase = new ProjectEquipmentsUseCase() }
export class ProjectFlowDetailsController extends ControllerInterface<ProjectFlowDetailsModel> {
  constructor() { super() }
  async show(params: Params) {
    this.setLoading()
    const state = await new ProjectFlowDetailsUseCase().call(params)
    this.setState(state)
    return state
  }
}

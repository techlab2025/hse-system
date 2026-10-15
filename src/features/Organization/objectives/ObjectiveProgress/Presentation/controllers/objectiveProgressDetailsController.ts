import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ObjectiveProgressDetailsParams from '../../Core/params/objectiveProgressDetailsParams'
import type ObjectiveProgressModel from '../../Data/models/objectiveProgressModel'
import ObjectiveProgressDetailsUseCase from '../../Domain/useCase/objectiveProgressDetailsUseCase'

export default class ObjectiveProgressDetailsController extends ControllerInterface<ObjectiveProgressModel> {
  private static instance: ObjectiveProgressDetailsController

  private constructor() {
    super()
  }

  private objectiveProgressDetailsUseCase = new ObjectiveProgressDetailsUseCase()

  static getInstance() {
    if (!this.instance) this.instance = new ObjectiveProgressDetailsController()
    return this.instance
  }

  async getDetails(params: ObjectiveProgressDetailsParams) {
    this.setLoading()
    const dataState: DataState<ObjectiveProgressModel> =
      await this.objectiveProgressDetailsUseCase.call(params)
    this.setState(dataState)
    super.handleResponseDialogs()
    return this.state
  }
}

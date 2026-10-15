import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type IndexObjectiveProgressParams from '../../Core/params/indexObjectiveProgressParams'
import type ObjectiveProgressHistoryModel from '../../Data/models/objectiveProgressHistoryModel'
import IndexObjectiveProgressUseCase from '../../Domain/useCase/indexObjectiveProgressUseCase'

export default class IndexObjectiveProgressController extends ControllerInterface<ObjectiveProgressHistoryModel> {
  private static instance: IndexObjectiveProgressController

  private constructor() {
    super()
  }

  private indexObjectiveProgressUseCase = new IndexObjectiveProgressUseCase()

  static getInstance() {
    if (!this.instance) this.instance = new IndexObjectiveProgressController()
    return this.instance
  }

  async getData(params: IndexObjectiveProgressParams) {
    this.setLoading()
    const dataState: DataState<ObjectiveProgressHistoryModel> =
      await this.indexObjectiveProgressUseCase.call(params)
    this.setState(dataState)
    super.handleResponseDialogs()
    return this.state
  }
}

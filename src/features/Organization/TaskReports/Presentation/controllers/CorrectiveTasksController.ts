import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type TaskReportModel from '../../Data/models/TaskReportModel'
import FetchCorrectiveTasksUseCase from '../../Domain/useCases/FetchCorrectiveTasksUseCase'

export default class CorrectiveTasksController extends ControllerInterface<TaskReportModel[]> {
  private static instance: CorrectiveTasksController
  private readonly useCase = new FetchCorrectiveTasksUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new CorrectiveTasksController()
    return this.instance
  }

  async fetch(params: Params) {
    this.setLoading()
    const state: DataState<TaskReportModel[]> = await this.useCase.call(params)
    this.setState(state)
    return this.state
  }
}

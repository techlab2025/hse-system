import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type LessonLearntReportModel from '../../Data/models/LessonLearntReportModel'
import FetchLessonsLearntUseCase from '../../Domain/useCases/FetchLessonsLearntUseCase'

export default class LessonsLearntController extends ControllerInterface<
  LessonLearntReportModel[]
> {
  private static instance: LessonsLearntController
  private readonly useCase = new FetchLessonsLearntUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new LessonsLearntController()
    return this.instance
  }

  async fetch(params: Params) {
    this.setLoading()
    const state: DataState<LessonLearntReportModel[]> = await this.useCase.call(params)
    this.setState(state)
    return this.state
  }
}

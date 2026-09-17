import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type TodayTalkModel from '../../../Data/models/TodayTalk/TodayTalkModel'
import GetTodayTalkUseCase from '../../../Domain/useCase/TodayTalk/GetTodayTalkUseCase'

export default class GetTodayTalkController extends ControllerInterface<TodayTalkModel[]> {
  private static instance: GetTodayTalkController
  private readonly useCase = new GetTodayTalkUseCase()

  private constructor() {
    super()
  }

  static getInstance(): GetTodayTalkController {
    if (!this.instance) this.instance = new GetTodayTalkController()
    return this.instance
  }

  async getTodayTalk(params: Params) {
    this.setLoading()
    const dataState: DataState<TodayTalkModel[]> = await this.useCase.call(params)
    this.setState(dataState)
    return this.state
  }
}

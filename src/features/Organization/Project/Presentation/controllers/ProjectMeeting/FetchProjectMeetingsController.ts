import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type ProjectMeetingModel from '../../../Data/models/ProjectMeeting/ProjectMeetingModel'
import FetchProjectMeetingsUseCase from '../../../Domain/useCase/ProjectMeeting/FetchProjectMeetingsUseCase'

export default class FetchProjectMeetingsController extends ControllerInterface<
  ProjectMeetingModel[]
> {
  private static instance: FetchProjectMeetingsController
  private readonly useCase = new FetchProjectMeetingsUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchProjectMeetingsController()
    return this.instance
  }

  async fetchMeetings(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}

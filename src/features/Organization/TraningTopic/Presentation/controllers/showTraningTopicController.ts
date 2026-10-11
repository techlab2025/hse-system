import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ShowTraningTopicParams from '../../Core/params/showTraningTopicParams'
import type TraningTopicDetailsModel from '../../Data/models/TraningTopicDetailsModel'
import ShowTraningTopicUseCase from '../../Domain/useCase/showTraningTopicUseCase'

export default class ShowTraningTopicController extends ControllerInterface<TraningTopicDetailsModel> {
  private static instance: ShowTraningTopicController

  private constructor() {
    super()
  }

  private showTraningTopicUseCase = new ShowTraningTopicUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTraningTopicController()
    }
    return this.instance
  }

  async showTraningTopic(params: ShowTraningTopicParams) {
    this.setLoading()
    const dataState: DataState<TraningTopicDetailsModel> =
      await this.showTraningTopicUseCase.call(params)
    this.setState(dataState)

    if (!this.isDataSuccess()) {
      throw new Error('Error while fetch Traning Topic details')
    }

    super.handleResponseDialogs()
    return this.state
  }
}

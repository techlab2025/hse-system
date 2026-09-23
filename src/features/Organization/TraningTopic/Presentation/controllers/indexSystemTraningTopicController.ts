import TraningTopicModel from '@/features/Organization/TraningTopic/Data/models/TraningTopicModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import IndexTraningTopicUseCase from '@/features/Organization/TraningTopic/Domain/useCase/indexTraningTopicUseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'

export default class IndexSystemTraningTopicController extends SelectControllerInterface<
  TraningTopicModel[]
> {
  private static instance: IndexSystemTraningTopicController

  private constructor() {
    super()
  }

  private IndexTraningTopicUseCase = new IndexTraningTopicUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemTraningTopicController()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<TraningTopicModel[]> =
      await this.IndexTraningTopicUseCase.call(params)
    this.setState(dataState)

    super.handleResponseDialogs()
    return this.state
  }
}

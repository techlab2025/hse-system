import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type MangementChangeTopicTypeDetailsModel from '../../Data/models/MangementChangeTopicTypeDetailsModel'
import ShowMangementChangeTopicTypeUseCase from '../../Domain/useCase/showMangementChangeTopicTypeUseCase'

export default class ShowMangementChangeTopicTypeController extends ControllerInterface<MangementChangeTopicTypeDetailsModel> {
  private static instance: ShowMangementChangeTopicTypeController

  private constructor() {
    super()
  }

  private ShowMangementChangeTopicTypeUseCase = new ShowMangementChangeTopicTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowMangementChangeTopicTypeController()
    }
    return this.instance
  }

  async showMangementChangeTopicType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<MangementChangeTopicTypeDetailsModel> =
      await this.ShowMangementChangeTopicTypeUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}

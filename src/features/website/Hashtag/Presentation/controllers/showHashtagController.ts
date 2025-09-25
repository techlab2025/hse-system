import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type HashtagteDetailsModel from '../../Data/models/HashtagDetailsModel'
import ShowHashtagteUseCase from '../../Domain/useCase/showHashtagUseCase'

export default class ShowHashtagteController extends ControllerInterface<HashtagteDetailsModel> {
  private static instance: ShowHashtagteController

  private constructor() {
    super()
  }

  private ShowHashtagteUseCase = new ShowHashtagteUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHashtagteController()
    }
    return this.instance
  }

  async showHashtag(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<HashtagteDetailsModel> =
      await this.ShowHashtagteUseCase.call(params)

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

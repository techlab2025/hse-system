import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type HerikalyDetailsModel from '../../Data/models/HerikalyDetailsModel'
import ShowHerikalyUseCase from '../../Domain/useCase/showHerikalyUseCase'

export default class ShowHerikalyController extends ControllerInterface<HerikalyDetailsModel> {
  private static instance: ShowHerikalyController

  private constructor() {
    super()
  }

  private ShowHerikalyUseCase = new ShowHerikalyUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHerikalyController()
    }
    return this.instance
  }

  async showHerikaly(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<HerikalyDetailsModel> = await this.ShowHerikalyUseCase.call(params)

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

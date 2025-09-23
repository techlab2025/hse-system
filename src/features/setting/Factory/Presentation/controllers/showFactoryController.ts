import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type FactoryModel from '../../Data/models/FactoryModel'
import ShowFactoryUseCase from '../../Domain/useCase/showFactoryUseCase'

export default class ShowFactoryController extends ControllerInterface<FactoryModel> {
  private static instance: ShowFactoryController

  private constructor() {
    super()
  }

  private ShowFactoryUseCase = new ShowFactoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowFactoryController()
    }
    return this.instance
  }

  async showFactory(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<FactoryModel> = await this.ShowFactoryUseCase.call(params)

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

import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type DrillTypeDetailsModel from '../../Data/models/DrillTypeDetailsModel'
import ShowDrillTypeUseCase from '../../Domain/useCase/showDrillTypeUseCase'

export default class ShowDrillTypeController extends ControllerInterface<DrillTypeDetailsModel> {
  private static instance: ShowDrillTypeController

  private constructor() {
    super()
  }

  private ShowDrillTypeUseCase = new ShowDrillTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowDrillTypeController()
    }
    return this.instance
  }

  async showDrillType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<DrillTypeDetailsModel> =
      await this.ShowDrillTypeUseCase.call(params)

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

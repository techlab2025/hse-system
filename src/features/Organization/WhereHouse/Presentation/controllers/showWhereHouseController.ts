import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type WhereHouseDetailsModel from '../../Data/models/WhereHouseDetailsModel'
import ShowWhereHouseUseCase from '../../Domain/useCase/showWhereHouseUseCase'

export default class ShowWhereHouseteController extends ControllerInterface<WhereHouseDetailsModel> {
  private static instance: ShowWhereHouseteController

  private constructor() {
    super()
  }

  private ShowWhereHouseUseCase = new ShowWhereHouseUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowWhereHouseteController()
    }
    return this.instance
  }

  async showWhereHouse(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<WhereHouseDetailsModel> =
      await this.ShowWhereHouseUseCase.call(params)

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

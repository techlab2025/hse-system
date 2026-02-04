import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowCatalogItemsUseCase from '../../Domain/useCase/showCatalogItemsUseCase'
import type CatalogItemsDetailsModel from '../../Data/models/CatalogItemsDetailsModel'

export default class ShowCatalogItemsController extends ControllerInterface<CatalogItemsDetailsModel> {
  private static instance: ShowCatalogItemsController

  private constructor() {
    super()
  }

  private showCatalogItemsUseCase = new ShowCatalogItemsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowCatalogItemsController()
    }
    return this.instance
  }

  async showCatalogItemsType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<CatalogItemsDetailsModel> = await this.showCatalogItemsUseCase.call(params)

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

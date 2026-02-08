import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowCatalogItemsDetailsUseCase from '../../Domain/useCase/showCatalogItemsDetailsUseCase'
import type CatalogItemsDetailsModel from '../../Data/models/CatalogItemsDetailsModel'

export default class ShowCatalogItemsDetailsController extends ControllerInterface<CatalogItemsDetailsModel> {
  private static instance: ShowCatalogItemsDetailsController

  private constructor() {
    super()
  }

  private showCatalogItemsDetailsUseCase = new ShowCatalogItemsDetailsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowCatalogItemsDetailsController()
    }
    return this.instance
  }

  async showCatalogItemsDetails(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<CatalogItemsDetailsModel> = await this.showCatalogItemsDetailsUseCase.call(params)

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

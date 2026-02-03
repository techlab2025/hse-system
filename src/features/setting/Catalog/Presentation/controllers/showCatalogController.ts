import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type CatalogDetailsModel from '../../Data/models/CatalogDetailsModel'
import ShowCatalogUseCase from '../../Domain/useCase/showCatalogUseCase'

export default class ShowCatalogController extends ControllerInterface<CatalogDetailsModel> {
  private static instance: ShowCatalogController

  private constructor() {
    super()
  }

  private showCatalogUseCase = new ShowCatalogUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowCatalogController()
    }
    return this.instance
  }

  async showCatalogType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<CatalogDetailsModel> = await this.showCatalogUseCase.call(params)

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

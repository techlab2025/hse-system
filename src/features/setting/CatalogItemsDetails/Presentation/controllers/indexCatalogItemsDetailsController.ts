// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type CatalogItemsModel from '../../Data/models/CatalogItemsModel'
import IndexCatalogItemsDetailsUseCase from '../../Domain/useCase/indexCatalogItemsDetailsUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexCatalogItemsDetailsController extends SelectControllerInterface<CatalogItemsModel[]> {
  private static instance: IndexCatalogItemsDetailsController
  private constructor() {
    super()
  }
  private indexCatalogItemsDetailsUseCase = new IndexCatalogItemsDetailsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexCatalogItemsDetailsController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<CatalogItemsModel[]> = await this.indexCatalogItemsDetailsUseCase.call(params)

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

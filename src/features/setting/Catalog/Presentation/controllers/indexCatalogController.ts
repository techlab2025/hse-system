// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type CatalogModel from '../../Data/models/CatalogModel'
import IndexCatalogUseCase from '../../Domain/useCase/indexCatalogUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexCatalogController extends SelectControllerInterface<CatalogModel[]> {
  private static instance: IndexCatalogController
  private constructor() {
    super()
  }
  private indexCatalogUseCase = new IndexCatalogUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexCatalogController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<CatalogModel[]> = await this.indexCatalogUseCase.call(params)

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

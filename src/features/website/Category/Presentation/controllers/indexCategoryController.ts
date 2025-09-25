// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type CategoryModel from '../../Data/models/CategoryModel'
import IndexCategoryUseCase from '../../Domain/useCase/indexCategoryUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexCategoryController extends SelectControllerInterface<
  CategoryModel[]
> {
  private static instance: IndexCategoryController
  private constructor() {
    super()
  }
  private IndexCategoryUseCase = new IndexCategoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexCategoryController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<CategoryModel[]> =
      await this.IndexCategoryUseCase.call(params)

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

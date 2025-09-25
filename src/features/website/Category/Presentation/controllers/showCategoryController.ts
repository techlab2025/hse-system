import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type CategoryteDetailsModel from '../../Data/models/CategoryDetailsModel'
import ShowCategoryteUseCase from '../../Domain/useCase/showCategoryUseCase'

export default class ShowCategoryteController extends ControllerInterface<CategoryteDetailsModel> {
  private static instance: ShowCategoryteController

  private constructor() {
    super()
  }

  private ShowCategoryteUseCase = new ShowCategoryteUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowCategoryteController()
    }
    return this.instance
  }

  async showCategory(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<CategoryteDetailsModel> =
      await this.ShowCategoryteUseCase.call(params)

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

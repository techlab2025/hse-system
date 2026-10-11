import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type DocumentCategoryDetailsModel from '../../Data/models/DocumentCategoryDetailsModel'
import ShowDocumentCategoryUseCase from '../../Domain/useCase/showDocumentCategoryUseCase'

export default class ShowDocumentCategoryController extends ControllerInterface<DocumentCategoryDetailsModel> {
  private static instance: ShowDocumentCategoryController

  private constructor() {
    super()
  }

  private ShowDocumentCategoryUseCase = new ShowDocumentCategoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowDocumentCategoryController()
    }
    return this.instance
  }

  async showDocumentCategory(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<DocumentCategoryDetailsModel> =
      await this.ShowDocumentCategoryUseCase.call(params)

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

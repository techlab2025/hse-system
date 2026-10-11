// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type DocumentCategoryModel from '../../Data/models/DocumentCategoryModel'
import IndexDocumentCategoryUseCase from '../../Domain/useCase/indexDocumentCategoryUseCase'

export default class IndexSystemDocumentCategoryController extends SelectControllerInterface<
  DocumentCategoryModel[]
> {
  private static instance: IndexSystemDocumentCategoryController
  private constructor() {
    super()
  }
  private IndexDocumentCategoryUseCase = new IndexDocumentCategoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemDocumentCategoryController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<DocumentCategoryModel[]> =
      await this.IndexDocumentCategoryUseCase.call(params)

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

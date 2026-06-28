import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type DocumentRefrenceModel from '../../Data/models/DocumentRefrenceModel'
import IndexDocumentRefrenceUseCase from '../../Domain/useCase/IndexDocumentRefrenceUseCase'

export default class IndexDocumentRefrenceController extends SelectControllerInterface<
  DocumentRefrenceModel[]
> {
  private static instance: IndexDocumentRefrenceController
  private constructor() {
    super()
  }
  private IndexDocumentRefrenceUseCase = new IndexDocumentRefrenceUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexDocumentRefrenceController()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<DocumentRefrenceModel[]> =
      await this.IndexDocumentRefrenceUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}

import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowDocumentRefrenceUseCase from '../../Domain/useCase/ShowDocumentRefrenceUseCase'
import type DocumentRefrenceDetailsModel from '../../Data/models/DocumentRefrenceDetailsModel'

export default class ShowDocumentRefrenceController extends ControllerInterface<DocumentRefrenceDetailsModel> {
  private static instance: ShowDocumentRefrenceController

  private constructor() {
    super()
  }

  private ShowDocumentRefrenceUseCase = new ShowDocumentRefrenceUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowDocumentRefrenceController()
    }
    return this.instance
  }

  async showDocumentRefrence(params: Params) {
    this.setLoading()

    const dataState: DataState<DocumentRefrenceDetailsModel> =
      await this.ShowDocumentRefrenceUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}

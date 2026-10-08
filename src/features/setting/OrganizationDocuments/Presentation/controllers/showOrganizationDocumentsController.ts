import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type OrganizationDocumentsDetailsModel from '../../Data/models/OrganizationDocumentsDetailsModel'
import ShowOrganizationDocumentsUseCase from '../../Domain/useCase/showOrganizationDocumentsUseCase'

export default class ShowOrganizationDocumentsController extends ControllerInterface<OrganizationDocumentsDetailsModel> {
  private static instance: ShowOrganizationDocumentsController

  private constructor() {
    super()
  }

  private ShowOrganizationDocumentsUseCase = new ShowOrganizationDocumentsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowOrganizationDocumentsController()
    }
    return this.instance
  }

  async showOrganizationDocuments(params: Params) {
    this.setLoading()

    const dataState: DataState<OrganizationDocumentsDetailsModel> =
      await this.ShowOrganizationDocumentsUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
    } else {
      throw new Error('Unable to load documents')
    }
    super.handleResponseDialogs()
    return this.state
  }
}

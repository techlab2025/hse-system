import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type OrganizationDocumentsModel from '../../Data/models/OrganizationDocumentsModel'
import IndexOrganizationDocumentsUseCase from '../../Domain/useCase/indexOrganizationDocumentsUseCase'

export default class IndexOrganizationDocumentsController extends SelectControllerInterface<
  OrganizationDocumentsModel[]
> {
  private static instance: IndexOrganizationDocumentsController
  private constructor() {
    super()
  }
  private IndexOrganizationDocumentsUseCase = new IndexOrganizationDocumentsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexOrganizationDocumentsController()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<OrganizationDocumentsModel[]> =
      await this.IndexOrganizationDocumentsUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
    } else {
      throw new Error('Unable to load documents')
    }
    super.handleResponseDialogs()
    return this.state
  }
}

import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type OrganizationDetailsModel from '../../Data/models/OrganizationDetailsModel'
import ShowOrganizationUseCase from '../../Domain/useCase/showOrganizationUseCase'

export default class ShowOrganizationController extends ControllerInterface<OrganizationDetailsModel> {
  private static instance: ShowOrganizationController

  private constructor() {
    super()
  }

  private showOrganizationUseCase = new ShowOrganizationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowOrganizationController()
    }
    return this.instance
  }

  async showOrganization(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<OrganizationDetailsModel> =
      await this.showOrganizationUseCase.call(params)

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

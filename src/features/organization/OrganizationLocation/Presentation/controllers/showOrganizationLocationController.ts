import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type OrganizationLocationDetailsModel from '../../Data/models/OrganizationLocationDetailsModel'
import ShowOrganizationLocationUseCase from '../../Domain/useCase/showOrganizationLocationUseCase'

export default class ShowOrganizationLocationteController extends ControllerInterface<OrganizationLocationDetailsModel> {
  private static instance: ShowOrganizationLocationteController

  private constructor() {
    super()
  }

  private ShowOrganizationLocationUseCase = new ShowOrganizationLocationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowOrganizationLocationteController()
    }
    return this.instance
  }

  async showOrganizationLocation(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<OrganizationLocationDetailsModel> =
      await this.ShowOrganizationLocationUseCase.call(params)

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

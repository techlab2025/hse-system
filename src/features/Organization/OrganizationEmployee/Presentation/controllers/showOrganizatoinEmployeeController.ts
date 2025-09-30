import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowOrganizatoinEmployeeUseCase from '../../Domain/useCase/showOrganizatoinEmployeeUseCase'
import type OrganizatoinEmployeeDetailsModel from '../../Data/models/OrganizatoinEmployeeDetailsModel'

export default class ShowOrganizatoinEmployeeController extends ControllerInterface<OrganizatoinEmployeeDetailsModel> {
  private static instance: ShowOrganizatoinEmployeeController

  private constructor() {
    super()
  }

  private ShowOrganizatoinEmployeeUseCase = new ShowOrganizatoinEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowOrganizatoinEmployeeController()
    }
    return this.instance
  }

  async showOrganizatoinEmployee(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<OrganizatoinEmployeeDetailsModel> =
      await this.ShowOrganizatoinEmployeeUseCase.call(params)

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

import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type RoleDetailsModel from '../../Data/models/RoleDetailsModel'
import ShowRoleUseCase from '../../Domain/useCase/showRoleUseCase'

export default class ShowRoleteController extends ControllerInterface<RoleDetailsModel> {
  private static instance: ShowRoleteController

  private constructor() {
    super()
  }

  private ShowRoleUseCase = new ShowRoleUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowRoleteController()
    }
    return this.instance
  }

  async showRole(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<RoleDetailsModel> = await this.ShowRoleUseCase.call(params)

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

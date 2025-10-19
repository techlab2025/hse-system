import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowEmployeeUseCase from '../../Domain/useCase/showEmployeeUseCase'
import type EmployeeDetailsModel from '../../Data/models/equipmentDetailsModel'

export default class ShowEmployeeController extends ControllerInterface<EmployeeDetailsModel> {
  private static instance: ShowEmployeeController

  private constructor() {
    super()
  }

  private showEmployeeUseCase = new ShowEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowEmployeeController()
    }
    return this.instance
  }

  async showEmployeeType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<EmployeeDetailsModel> = await this.showEmployeeUseCase.call(params)

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

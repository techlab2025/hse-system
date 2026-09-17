// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type IndexOwnTaskModel from '../../../Data/models/IndexOwnTaskModel'
import ChangeTaskStatusUseCase from '../../../Domain/useCase/employeeTask/ChangeTaskStatusUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class changeTaskStatusController extends SelectControllerInterface<
  IndexOwnTaskModel
> {
  private static instance: changeTaskStatusController
  private constructor() {
    super()
  }
  private changeTaskStatusUseCase = new ChangeTaskStatusUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new changeTaskStatusController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<IndexOwnTaskModel> =
      await this.changeTaskStatusUseCase.call(params)

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

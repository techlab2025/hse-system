// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type SystemRiskManagementModel from '../../Data/models/SystemRiskManagementModel'
import IndexSystemRiskManagementUseCase from '../../Domain/useCase/indexSystemRiskManagementUseCase'


// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexSystemRiskManagementController extends SelectControllerInterface<
  SystemRiskManagementModel[]
> {
  private static instance: IndexSystemRiskManagementController
  private constructor() {
    super()
  }
  private IndexSystemRiskManagementUseCase = new IndexSystemRiskManagementUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemRiskManagementController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<SystemRiskManagementModel[]> =
      await this.IndexSystemRiskManagementUseCase.call(params)

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

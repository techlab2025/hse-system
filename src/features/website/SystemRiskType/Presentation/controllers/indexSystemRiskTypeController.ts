// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type SystemRiskTypeModel from '../../Data/models/SystemRiskTypeModel'
import IndexSystemRiskTypeUseCase from '../../Domain/useCase/indexSystemRiskTypeUseCase'

// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexSystemRiskTypeController extends SelectControllerInterface<
  SystemRiskTypeModel[]
> {
  private static instance: IndexSystemRiskTypeController
  private constructor() {
    super()
  }
  private indexSystemRiskTypeUseCase = new IndexSystemRiskTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemRiskTypeController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<SystemRiskTypeModel[]> =
      await this.indexSystemRiskTypeUseCase.call(params)

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

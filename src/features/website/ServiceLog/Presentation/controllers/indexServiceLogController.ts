// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type ServiceLogModel from '../../Data/models/ServiceLogModel'
import IndexServiceLogUseCase from '../../Domain/useCase/indexServiceLogUseCase'

// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexServiceLogController extends SelectControllerInterface<
  ServiceLogModel[]
> {
  private static instance: IndexServiceLogController
  private constructor() {
    super()
  }
  private indexServiceLogUseCase = new IndexServiceLogUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexServiceLogController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ServiceLogModel[]> =
      await this.indexServiceLogUseCase.call(params)

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

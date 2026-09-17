// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type DrillTypeModel from '../../Data/models/DrillTypeModel'
import IndexDrillTypeUseCase from '../../Domain/useCase/indexDrillTypeUseCase'

export default class IndexSystemDrillTypeController extends SelectControllerInterface<
  DrillTypeModel[]
> {
  private static instance: IndexSystemDrillTypeController
  private constructor() {
    super()
  }
  private IndexDrillTypeUseCase = new IndexDrillTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemDrillTypeController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<DrillTypeModel[]> =
      await this.IndexDrillTypeUseCase.call(params)

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

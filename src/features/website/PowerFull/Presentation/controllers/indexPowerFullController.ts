// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type PowerFullModel from '../../Data/models/PowerFullModel'
import IndexPowerFullUseCase from '../../Domain/useCase/indexPowerFullUseCase'

// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexPowerFullController extends SelectControllerInterface<
  PowerFullModel[]
> {
  private static instance: IndexPowerFullController
  private constructor() {
    super()
  }
  private IndexPowerFullUseCase = new IndexPowerFullUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexPowerFullController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<PowerFullModel[]> =
      await this.IndexPowerFullUseCase.call(params)

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

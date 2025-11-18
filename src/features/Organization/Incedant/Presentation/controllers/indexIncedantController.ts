// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type IncedantModel from '../../Data/models/IncedantModel'
import IndexIncedantUseCase from '../../Domain/useCase/indexIncedantUseCase'


export default class IndexIncedantController extends SelectControllerInterface<
  IncedantModel[]
> {
  private static instance: IndexIncedantController
  private constructor() {
    super()
  }
  private IndexIncedantUseCase = new IndexIncedantUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexIncedantController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<IncedantModel[]> =
      await this.IndexIncedantUseCase.call(params)

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

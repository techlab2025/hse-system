// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type PPEActivityModel from '../../Data/models/PPEActivityModel'
import IndexPPEActivityUseCase from '../../Domain/useCase/indexPPEActivityUseCase'

export default class IndexSystemPPEActivityController extends SelectControllerInterface<
  PPEActivityModel[]
> {
  private static instance: IndexSystemPPEActivityController
  private constructor() {
    super()
  }
  private IndexPPEActivityUseCase = new IndexPPEActivityUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemPPEActivityController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<PPEActivityModel[]> =
      await this.IndexPPEActivityUseCase.call(params)

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

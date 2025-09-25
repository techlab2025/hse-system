// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexSystemWorkUseCase from '../../Domain/useCase/indexSystemWorkUseCase'
import type SystemWorkModel from '../../Data/models/SystemWorkModel'


// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexSystemWorkController extends SelectControllerInterface<
  SystemWorkModel[]
> {
  private static instance: IndexSystemWorkController
  private constructor() {
    super()
  }
  private IndexSystemWorkUseCase = new IndexSystemWorkUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemWorkController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<SystemWorkModel[]> =
      await this.IndexSystemWorkUseCase.call(params)

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

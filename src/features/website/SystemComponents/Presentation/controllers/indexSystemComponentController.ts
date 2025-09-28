// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type SystemComponentModel from '../../Data/models/SystemComponentModel'
import IndexSystemComponentUseCase from '../../Domain/useCase/indexSystemComponentUseCase'

// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexSystemComponentController extends SelectControllerInterface<
  SystemComponentModel[]
> {
  private static instance: IndexSystemComponentController
  private constructor() {
    super()
  }
  private indexSystemComponentUseCase = new IndexSystemComponentUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemComponentController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<SystemComponentModel[]> =
      await this.indexSystemComponentUseCase.call(params)

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

// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexHeaderUseCase from '../../Domain/useCase/indexHeaderUseCase'
import type HeaderModel from '../../Data/models/HeaderModel'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexHeaderController extends SelectControllerInterface<
  HeaderModel[]
> {
  private static instance: IndexHeaderController
  private constructor() {
    super()
  }
  private IndexHeaderUseCase = new IndexHeaderUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHeaderController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<HeaderModel[]> =
      await this.IndexHeaderUseCase.call(params)

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

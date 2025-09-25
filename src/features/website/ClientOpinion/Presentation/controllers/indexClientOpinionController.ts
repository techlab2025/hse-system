// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type ClientOpinionModel from '../../Data/models/ClientOpinionModel'
import IndexClientOpinionUseCase from '../../Domain/useCase/indexClientOpinionUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexClientOpinionController extends SelectControllerInterface<
  ClientOpinionModel[]
> {
  private static instance: IndexClientOpinionController
  private constructor() {
    super()
  }
  private IndexClientOpinionUseCase = new IndexClientOpinionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexClientOpinionController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ClientOpinionModel[]> =
      await this.IndexClientOpinionUseCase.call(params)

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

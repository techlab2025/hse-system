// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type FaqModel from '../../Data/models/FaqModel'
import IndexFaqUseCase from '../../Domain/useCase/indexFaqUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexFaqController extends SelectControllerInterface<
  FaqModel[]
> {
  private static instance: IndexFaqController
  private constructor() {
    super()
  }
  private IndexFaqUseCase = new IndexFaqUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexFaqController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<FaqModel[]> =
      await this.IndexFaqUseCase.call(params)

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

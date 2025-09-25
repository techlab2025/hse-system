// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type HashtagModel from '../../Data/models/TermModel'
import IndexHashtagUseCase from '../../Domain/useCase/indexHashtagUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexHashtagController extends SelectControllerInterface<
  HashtagModel[]
> {
  private static instance: IndexHashtagController
  private constructor() {
    super()
  }
  private IndexHashtagUseCase = new IndexHashtagUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHashtagController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<HashtagModel[]> =
      await this.IndexHashtagUseCase.call(params)

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

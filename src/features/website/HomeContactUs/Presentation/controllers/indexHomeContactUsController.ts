// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexHomeContactUsUseCase from '../../Domain/useCase/indexHomeContactUsUseCase'
import type HomeContactUsModel from '../../Data/models/HomeContactUsModel'


// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexHomeContactUsController extends SelectControllerInterface<
  HomeContactUsModel[]
> {
  private static instance: IndexHomeContactUsController
  private constructor() {
    super()
  }
  private IndexHomeContactUsUseCase = new IndexHomeContactUsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHomeContactUsController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<HomeContactUsModel[]> =
      await this.IndexHomeContactUsUseCase.call(params)

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

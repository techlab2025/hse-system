// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type HomeAboutUsModel from '../../Data/models/HomeAboutUsModel'
import IndexHomeAboutUsUseCase from '../../Domain/useCase/indexHomeAboutUsUseCase'

// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexHomeAboutUsController extends SelectControllerInterface<
  HomeAboutUsModel[]
> {
  private static instance: IndexHomeAboutUsController
  private constructor() {
    super()
  }
  private IndexHomeAboutUsUseCase = new IndexHomeAboutUsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHomeAboutUsController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<HomeAboutUsModel[]> =
      await this.IndexHomeAboutUsUseCase.call(params)

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

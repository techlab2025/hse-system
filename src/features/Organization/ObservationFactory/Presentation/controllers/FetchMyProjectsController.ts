import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type MyProjectsModel from '../../Data/models/MyProjectsModel'
import FetchMyProjectsUseCase from '../../Domain/useCase/FetchMyProjectsUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class FetchMyProjectsController extends SelectControllerInterface<
  MyProjectsModel[]
> {
  private static instance: FetchMyProjectsController
  private constructor() {
    super()
  }
  private fetchMyProjectsUseCase = new FetchMyProjectsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchMyProjectsController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    // this.setLoading()
    const dataState: DataState<MyProjectsModel[]> = await this.fetchMyProjectsUseCase.call(params)

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

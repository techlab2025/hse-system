// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type ProjectProgressModel from '../../Data/models/ProjectProgressModel'
import IndexProjectProgressUseCase from '../../Domain/useCase/indexProjectProgressUseCase'

export default class IndexProjectProgressController extends SelectControllerInterface<ProjectProgressModel> {
  private static instance: IndexProjectProgressController
  private constructor() {
    super()
  }
  private IndexProjectProgressUseCase = new IndexProjectProgressUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexProjectProgressController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ProjectProgressModel> =
      await this.IndexProjectProgressUseCase.call(params)

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

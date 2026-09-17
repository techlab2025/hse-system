// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type IndexOwnTaskModel from '../../../Data/models/IndexOwnTaskModel'
import indexOwnTaskUseCase from '../../../Domain/useCase/employeeTask/indexOwnTaskUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexOwnTaskController extends SelectControllerInterface<
  IndexOwnTaskModel[]
> {
  private static instance: IndexOwnTaskController
  private constructor() {
    super()
  }
  private IndexOwnTaskUseCase = new indexOwnTaskUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexOwnTaskController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<IndexOwnTaskModel[]> =
      await this.IndexOwnTaskUseCase.call(params)

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

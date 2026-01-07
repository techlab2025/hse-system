// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import FetchTaskResultDetailsUseCase from '../../Domain/useCase/FetchTaskResultDetailsUseCase'
import type FetchTaskResultDetailsModel from '../../Data/models/FetchTaskResultDetails'

export default class FetchTaskResultDetailsController extends SelectControllerInterface<FetchTaskResultDetailsModel> {
  private static instance: FetchTaskResultDetailsController
  private constructor() {
    super()
  }
  private fetchTaskResultDetailsUseCase = new FetchTaskResultDetailsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchTaskResultDetailsController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<FetchTaskResultDetailsModel> =
      await this.fetchTaskResultDetailsUseCase.call(params)

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

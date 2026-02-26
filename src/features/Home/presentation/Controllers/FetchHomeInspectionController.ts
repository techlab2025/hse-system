import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import FetchHomeInspectionUseCase from '../../domain/usecase/FetchHomeInspectionUseCase'
import type FetchHomeInspectionModel from '../../data/Model/FetchHomeInspectionModel'

export default class FetchHomeInspectionController extends SelectControllerInterface<FetchHomeInspectionModel> {
  private static instance: FetchHomeInspectionController
  private constructor() {
    super()
  }
  private fetchHomeInspectionUseCase = new FetchHomeInspectionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchHomeInspectionController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<FetchHomeInspectionModel> =
      await this.fetchHomeInspectionUseCase.call(params)

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

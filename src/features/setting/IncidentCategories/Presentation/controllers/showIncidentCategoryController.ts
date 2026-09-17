import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowIncidentCategoryUseCase from '../../Domain/useCase/showIncidentCategoryUseCase'
import type IncidentCategoryDetailsModel from '../../Data/models/IncidentCategoryDetailsModel'

export default class ShowIncidentCategoryController extends ControllerInterface<IncidentCategoryDetailsModel> {
  private static instance: ShowIncidentCategoryController

  private constructor() {
    super()
  }

  private showIncidentCategoryUseCase = new ShowIncidentCategoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowIncidentCategoryController()
    }
    return this.instance
  }

  async showIncidentCategory(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<IncidentCategoryDetailsModel> =
      await this.showIncidentCategoryUseCase.call(params)

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

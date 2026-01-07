// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type InspectionModel from '../../Data/models/InspectionModel'
import FetchInspectionsResultsUseCase from '../../Domain/useCase/FetchInspectionsResultsUseCase'

export default class FetchInspectionsResultsController extends SelectControllerInterface<
  InspectionModel[]
> {
  private static instance: FetchInspectionsResultsController
  private constructor() {
    super()
  }
  private fetchInspectionsResultsUseCase = new FetchInspectionsResultsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchInspectionsResultsController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<InspectionModel[]> =
      await this.fetchInspectionsResultsUseCase.call(params)

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

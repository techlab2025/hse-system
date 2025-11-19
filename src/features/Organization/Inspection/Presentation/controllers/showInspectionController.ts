import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type InspectionDetailsModel from '../../Data/models/InspectionDetailsModel'
import ShowInspectionUseCase from '../../Domain/useCase/showInspectionUseCase'


export default class ShowInspectionController extends ControllerInterface<InspectionDetailsModel> {
  private static instance: ShowInspectionController

  private constructor() {
    super()
  }

  private ShowInspectionUseCase = new ShowInspectionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowInspectionController()
    }
    return this.instance
  }

  async showInspection(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<InspectionDetailsModel> = await this.ShowInspectionUseCase.call(params)

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

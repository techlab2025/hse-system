import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type ProjectZoneDetailsModel from '../../Data/models/ProjectZoneDetailsModel'
import ShowProjectZoneUseCase from '../../Domain/useCase/showProjectZoneUseCase'
export default class ShowProjectZoneController extends ControllerInterface<ProjectZoneDetailsModel> {
  private static instance: ShowProjectZoneController

  private constructor() {
    super()
  }

  private ShowProjectZoneUseCase = new ShowProjectZoneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowProjectZoneController()
    }
    return this.instance
  }

  async showProjectZone(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ProjectZoneDetailsModel> =
      await this.ShowProjectZoneUseCase.call(params)

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

// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type ProjectZoneModel from '../../Data/models/ProjectZonesModel'
import FetchProjectZoneUseCase from '../../Domain/useCase/FetchProjectZoneUseCase'

export default class FetchProjectZoneController extends SelectControllerInterface<
  ProjectZoneModel[]
> {
  private static instance: FetchProjectZoneController
  private constructor() {
    super()
  }
  private fetchProjectZoneUseCase = new FetchProjectZoneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchProjectZoneController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ProjectZoneModel[]> = await this.fetchProjectZoneUseCase.call(params)

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

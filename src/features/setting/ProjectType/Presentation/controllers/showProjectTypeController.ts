import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ShowHazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeDetailsModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowHazardTypeUseCase from '@/features/setting/HazardType/Domain/useCase/showHazardTypeUseCase'

export default class ShowProjectTypeController extends ControllerInterface<ShowHazardTypeModel> {
  private static instance: ShowProjectTypeController

  private constructor() {
    super()
  }

  private ShowHazardTypeUseCase = new ShowHazardTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowProjectTypeController()
    }
    return this.instance
  }

  async showHazardType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ShowHazardTypeModel> = await this.ShowHazardTypeUseCase.call(params)

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

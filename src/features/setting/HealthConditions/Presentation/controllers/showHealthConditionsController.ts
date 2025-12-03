import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ShowHealthConditionsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsDetailsModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowHealthConditionsUseCase from '@/features/setting/HealthConditions/Domain/useCase/showHealthConditionsUseCase'

export default class ShowHealthConditionsController extends ControllerInterface<ShowHealthConditionsModel> {
  private static instance: ShowHealthConditionsController

  private constructor() {
    super()
  }

  private ShowHealthConditionsUseCase = new ShowHealthConditionsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHealthConditionsController()
    }
    return this.instance
  }

  async showHealthConditions(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ShowHealthConditionsModel> = await this.ShowHealthConditionsUseCase.call(params)

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

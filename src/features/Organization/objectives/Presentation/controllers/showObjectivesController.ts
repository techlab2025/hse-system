import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowObjectivesUseCase from '../../Domain/useCase/showObjectivesUseCase'
import type ObjectivesDetailsModel from '../../Data/models/objectivesDetailsModel'

export default class ShowObjectivesController extends ControllerInterface<ObjectivesDetailsModel> {
  private static instance: ShowObjectivesController

  private constructor() {
    super()
  }

  private showObjectivesUseCase = new ShowObjectivesUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowObjectivesController()
    }
    return this.instance
  }

  async showObjectivesType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ObjectivesDetailsModel> = await this.showObjectivesUseCase.call(params)

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

import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowTeamUseCase from '../../Domain/useCase/showTeamUseCase'
import type TeamDetailsModel from '../../Data/models/TeamDetailsModel'

export default class ShowTeamController extends ControllerInterface<TeamDetailsModel> {
  private static instance: ShowTeamController

  private constructor() {
    super()
  }

  private showTeamUseCase = new ShowTeamUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTeamController()
    }
    return this.instance
  }

  async showTeamType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<TeamDetailsModel> = await this.showTeamUseCase.call(params)

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

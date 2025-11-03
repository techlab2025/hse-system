// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexTeamUseCase from '../../Domain/useCase/indexTeamUseCase'
import type TeamModel from '../../Data/models/TeamModel'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexTeamController extends SelectControllerInterface<TeamModel[]> {
  private static instance: IndexTeamController
  private constructor() {
    super()
  }
  private indexTeamUseCase = new IndexTeamUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexTeamController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<TeamModel[]> = await this.indexTeamUseCase.call(params)

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

import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type TeamModel from '../../Data/models/TeamModel'
import IndexSystemTeamUseCase from '../../Domain/useCase/indexSystemTeamUseCase'

export default class IndexSystemTeamController extends SelectControllerInterface<TeamModel[]> {
  private static instance: IndexSystemTeamController
  private readonly indexSystemTeamUseCase = new IndexSystemTeamUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemTeamController()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<TeamModel[]> = await this.indexSystemTeamUseCase.call(params)
    this.setState(dataState)

    if (!this.isDataSuccess()) {
      throw new Error('Error while fetching system teams')
    }

    super.handleResponseDialogs()
    return this.state
  }
}

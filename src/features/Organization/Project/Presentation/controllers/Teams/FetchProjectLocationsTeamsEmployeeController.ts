import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import FetchProjectLocationsTeamsEmployeeUseCase from '../../../Domain/useCase/Teams/FetchProjectLocationsTeamsEmployeeUsecase'
import type LocationTeamEmployeesModel from '../../../Data/models/Teams/ProjectLocationTeamEmployee'

export default class FetchProjectLocationsTeamsEmployeeController extends ControllerInterface<
  LocationTeamEmployeesModel[]
> {
  private static instance: FetchProjectLocationsTeamsEmployeeController

  private constructor() {
    super()
  }

  private fetchProjectLocationsTeamsEmployeeUseCase =
    new FetchProjectLocationsTeamsEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchProjectLocationsTeamsEmployeeController()
    }
    return this.instance
  }

  async FetchProjectLocationsTeamsEmployee(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<LocationTeamEmployeesModel[]> =
      await this.fetchProjectLocationsTeamsEmployeeUseCase.call(params)

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

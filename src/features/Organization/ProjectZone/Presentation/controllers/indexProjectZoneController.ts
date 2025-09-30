// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type ProjectZoneModel from '../../Data/models/ProjectZoneModel'
import IndexProjectZoneUseCase from '../../Domain/useCase/indexProjectZoneUseCase'



// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexProjectZoneController extends SelectControllerInterface<
  ProjectZoneModel[]
> {
  private static instance: IndexProjectZoneController
  private constructor() {
    super()
  }
  private IndexProjectZoneUseCase = new IndexProjectZoneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexProjectZoneController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ProjectZoneModel[]> =
      await this.IndexProjectZoneUseCase.call(params)

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

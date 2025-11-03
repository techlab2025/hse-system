// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type ProjectLocationModel from '@/features/Organization/Project/Data/models/projectLocation'
import IndexProjectLocationUseCase from '@/features/Organization/Project/Domain/useCase/Hierarchy/ProjectLocations/indexProjectLocationUseCase'

export default class IndexProjectLocationController extends SelectControllerInterface<
  ProjectLocationModel[]
> {
  private static instance: IndexProjectLocationController
  private constructor() {
    super()
  }
  private IndexProjectLocationUseCase = new IndexProjectLocationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexProjectLocationController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ProjectLocationModel[]> =
      await this.IndexProjectLocationUseCase.call(params)

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

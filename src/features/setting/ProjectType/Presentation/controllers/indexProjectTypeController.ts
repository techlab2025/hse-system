// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ProjectTypeModel from '@/features/setting/ProjectType/Data/models/projectTypeModel.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import IndexProjectTypeUseCase from '@/features/setting/ProjectType/Domain/useCase/indexProjectTypeUseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexProjectTypeController extends SelectControllerInterface<
  ProjectTypeModel[]
> {
  private static instance: IndexProjectTypeController
  private constructor() {
    super()
  }
  private IndexProjectTypeUseCase = new IndexProjectTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexProjectTypeController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ProjectTypeModel[]> =
      await this.IndexProjectTypeUseCase.call(params)

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

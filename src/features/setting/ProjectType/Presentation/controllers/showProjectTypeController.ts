import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ShowProjectTypeModel from '@/features/setting/ProjectType/Data/models/projectTypeDetailsModel.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowProjectTypeUseCase from '@/features/setting/ProjectType/Domain/useCase/showProjectTypeUseCase'

export default class ShowProjectTypeController extends ControllerInterface<ShowProjectTypeModel> {
  private static instance: ShowProjectTypeController

  private constructor() {
    super()
  }

  private ShowProjectTypeUseCase = new ShowProjectTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowProjectTypeController()
    }
    return this.instance
  }

  async showProjectType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ShowProjectTypeModel> =
      await this.ShowProjectTypeUseCase.call(params)

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

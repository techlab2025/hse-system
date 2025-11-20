// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import HealthConditionsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import IndexHealthConditionsUseCase from '@/features/setting/HealthConditions/Domain/useCase/indexHealthConditionsUseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexHealthConditionsController extends SelectControllerInterface<
  HealthConditionsModel[]
> {
  private static instance: IndexHealthConditionsController
  private constructor() {
    super()
  }
  private IndexHealthConditionsUseCase = new IndexHealthConditionsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHealthConditionsController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<HealthConditionsModel[]> =
      await this.IndexHealthConditionsUseCase.call(params)

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

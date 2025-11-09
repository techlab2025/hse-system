// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexObjectivesUseCase from '../../Domain/useCase/indexObjectivesUseCase'
import type ObjectivesModel from '../../Data/models/objectivesModel'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexObjectivesController extends SelectControllerInterface<ObjectivesModel[]> {
  private static instance: IndexObjectivesController
  private constructor() {
    super()
  }
  private indexObjectivesUseCase = new IndexObjectivesUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexObjectivesController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ObjectivesModel[]> = await this.indexObjectivesUseCase.call(params)

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

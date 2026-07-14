// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type IncidentCategoryModel from '../../Data/models/IncidentCategoryModel'
import IndexIncidentCategoryUseCase from '../../Domain/useCase/indexIncidentCategoryUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexSystemIncidentCategoryController extends SelectControllerInterface<
  IncidentCategoryModel[]
> {
  private static instance: IndexSystemIncidentCategoryController
  private constructor() {
    super()
  }
  private indexIncidentCategoryUseCase = new IndexIncidentCategoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemIncidentCategoryController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<IncidentCategoryModel[]> =
      await this.indexIncidentCategoryUseCase.call(params)

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

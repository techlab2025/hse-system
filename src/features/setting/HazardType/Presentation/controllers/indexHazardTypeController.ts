// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import HazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import IndexHazardTypeUseCase from '@/features/setting/HazardType/Domain/useCase/indexHazardTypeUseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexHazardTypeController extends SelectControllerInterface<
  HazardTypeModel[]
> {
  private static instance: IndexHazardTypeController
  private constructor() {
    super()
  }
  private IndexHazardTypeUseCase = new IndexHazardTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHazardTypeController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<HazardTypeModel[]> =
      await this.IndexHazardTypeUseCase.call(params)

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

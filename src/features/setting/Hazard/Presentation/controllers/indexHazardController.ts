// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexHazardUseCase from '../../Domain/useCase/indexHazardUseCase'
import type HazardModel from '../../Data/models/hazardModel'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexHazardController extends SelectControllerInterface<
  HazardModel[]
> {
  private static instance: IndexHazardController
  private constructor() {
    super()
  }
  private IndexHazardUseCase = new IndexHazardUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHazardController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<HazardModel[]> =
      await this.IndexHazardUseCase.call(params)

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

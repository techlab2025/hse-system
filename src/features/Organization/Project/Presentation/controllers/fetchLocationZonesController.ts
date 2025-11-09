// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type ProjectLocationZonesModel from '../../Data/models/ProjectLocationZones'
import IndexProjectLocationZonesUseCase from '../../Domain/useCase/fetchLocationZonesUseCase'

// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexProjectLocationZonesController extends SelectControllerInterface<
  ProjectLocationZonesModel[]
> {
  private static instance: IndexProjectLocationZonesController
  private constructor() {
    super()
  }
  private indexProjectLocationZonesUseCase = new IndexProjectLocationZonesUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexProjectLocationZonesController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ProjectLocationZonesModel[]> =
      await this.indexProjectLocationZonesUseCase.call(params)

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

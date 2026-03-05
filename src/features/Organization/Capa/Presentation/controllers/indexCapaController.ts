// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexCapaUseCase from '../../Domain/useCase/indexCapaUseCase'
import type CapaModel from '../../Data/models/CapaModel'
import type HazardModel from '@/features/Organization/ObservationFactory/Data/models/hazardModel'

export default class IndexCapaController extends SelectControllerInterface<HazardModel[]> {
  private static instance: IndexCapaController
  private constructor() {
    super()
  }
  private indexCapaUseCase = new IndexCapaUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexCapaController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<HazardModel[]> = await this.indexCapaUseCase.call(params)

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

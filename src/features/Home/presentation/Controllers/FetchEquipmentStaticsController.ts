import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type StatisticsMachineModel from '../../data/Model/StatisticsMachineModel'
import FetchEquipmentStaticsUseCase from '../../domain/usecase/FetchEquipemntStaticsUseCase'

export default class FetchEquipmentStaticsController extends SelectControllerInterface<StatisticsMachineModel> {
  private static instance: FetchEquipmentStaticsController
  private constructor() {
    super()
  }
  private fetchEquipmentStaticsUseCase = new FetchEquipmentStaticsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchEquipmentStaticsController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<StatisticsMachineModel> =
      await this.fetchEquipmentStaticsUseCase.call(params)

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

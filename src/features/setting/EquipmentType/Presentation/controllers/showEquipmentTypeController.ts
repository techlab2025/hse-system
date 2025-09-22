import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ShowEquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowEquipmentTypeUseCase from '@/features/setting/EquipmentType/Domain/useCase/showEquipmentTypeUseCase'

export default class ShowEquipmentTypeController extends ControllerInterface<ShowEquipmentTypeModel> {
  private static instance: ShowEquipmentTypeController

  private constructor() {
    super()
  }

  private ShowEquipmentTypeUseCase = new ShowEquipmentTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowEquipmentTypeController()
    }
    return this.instance
  }

  async showEquipmentType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ShowEquipmentTypeModel> =
      await this.ShowEquipmentTypeUseCase.call(params)

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

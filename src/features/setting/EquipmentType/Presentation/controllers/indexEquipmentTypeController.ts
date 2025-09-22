// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import IndexEquipmentTypeUseCase from '@/features/setting/EquipmentType/Domain/useCase/indexEquipmentTypeUseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexEquipmentTypeController extends SelectControllerInterface<
  EquipmentTypeModel[]
> {
  private static instance: IndexEquipmentTypeController
  private constructor() {
    super()
  }
  private IndexEquipmentTypeUseCase = new IndexEquipmentTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexEquipmentTypeController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<EquipmentTypeModel[]> =
      await this.IndexEquipmentTypeUseCase.call(params)

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

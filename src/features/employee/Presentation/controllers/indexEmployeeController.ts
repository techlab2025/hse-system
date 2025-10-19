// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type EmployeeModel from '../../Data/models/equipmentModel'
import IndexEmployeeUseCase from '../../Domain/useCase/indexEmployeeUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexEmployeeController extends SelectControllerInterface<EmployeeModel[]> {
  private static instance: IndexEmployeeController
  private constructor() {
    super()
  }
  private indexEmployeeUseCase = new IndexEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexEmployeeController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<EmployeeModel[]> = await this.indexEmployeeUseCase.call(params)

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

// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexContractorUseCase from '../../Domain/useCase/indexContractorUseCase'
import type ContractorModel from '../../Data/models/ContractorModel'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexContractorController extends SelectControllerInterface<ContractorModel[]> {
  private static instance: IndexContractorController
  private constructor() {
    super()
  }
  private indexContractorUseCase = new IndexContractorUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexContractorController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ContractorModel[]> = await this.indexContractorUseCase.call(params)

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

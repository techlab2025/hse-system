import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowContractorUseCase from '../../Domain/useCase/showContractorUseCase'
import type ContractorDetailsModel from '../../Data/models/ContractorDetailsModel'

export default class ShowContractorController extends ControllerInterface<ContractorDetailsModel> {
  private static instance: ShowContractorController

  private constructor() {
    super()
  }

  private showContractorUseCase = new ShowContractorUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowContractorController()
    }
    return this.instance
  }

  async showContractorType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ContractorDetailsModel> = await this.showContractorUseCase.call(params)

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

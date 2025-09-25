import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type ServiceSectionDetailsModel from '../../Data/models/ServiceDetailsSectionModel'
import ShowServiceSectionUseCase from '../../Domain/useCase/showServiceSectionUseCase'

export default class ShowServiceSectionController extends ControllerInterface<ServiceSectionDetailsModel> {
  private static instance: ShowServiceSectionController

  private constructor() {
    super()
  }

  private showServiceSectionUseCase = new ShowServiceSectionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowServiceSectionController()
    }
    return this.instance
  }

  async showServiceSection(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ServiceSectionDetailsModel> =
      await this.showServiceSectionUseCase.call(params)

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

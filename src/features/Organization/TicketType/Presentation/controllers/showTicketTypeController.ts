import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type TicketTypeModel from '../../Data/models/TicketTypeModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowTicketTypeUseCase from '../../Domain/useCase/showTicketTypeUseCase'
import type TicketTypeDetailsModel from '../../Data/models/TicketTypeDetailsModel'

export default class ShowTicketTypeController extends ControllerInterface<TicketTypeDetailsModel> {
  private static instance: ShowTicketTypeController

  private constructor() {
    super()
  }

  private ShowTicketTypeUseCase = new ShowTicketTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTicketTypeController()
    }
    return this.instance
  }

  async showTicketType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<TicketTypeDetailsModel> =
      await this.ShowTicketTypeUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error('Error while show TicketType')
    }
    super.handleResponseDialogs()
    return this.state
  }
}

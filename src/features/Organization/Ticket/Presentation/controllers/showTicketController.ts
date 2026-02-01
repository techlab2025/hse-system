import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type TicketModel from '../../Data/models/TicketModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowTicketUseCase from '../../Domain/useCase/showTicketUseCase'
import type TicketDetailsModel from '../../Data/models/TicketDetailsModel'

export default class ShowTicketController extends ControllerInterface<TicketDetailsModel> {
  private static instance: ShowTicketController

  private constructor() {
    super()
  }

  private ShowTicketUseCase = new ShowTicketUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTicketController()
    }
    return this.instance
  }

  async showTicket(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<TicketDetailsModel> = await this.ShowTicketUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error('Error while show Ticket')
    }
    super.handleResponseDialogs()
    return this.state
  }
}

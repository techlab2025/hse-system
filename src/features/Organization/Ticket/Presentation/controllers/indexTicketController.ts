// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import IndexTicketUseCase from '../../Domain/useCase/indexTicketUseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type TicketModel from '../../Data/models/TicketModel'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexTicketController extends SelectControllerInterface<
  TicketModel[]
> {
  private static instance: IndexTicketController
  private constructor() {
    super()
  }
  private IndexTicketUseCase = new IndexTicketUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexTicketController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<TicketModel[]> = await this.IndexTicketUseCase.call(params)

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

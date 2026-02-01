// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import IndexTicketTypeUseCase from '../../Domain/useCase/indexTicketTypeUseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type TicketTypeModel from '../../Data/models/TicketTypeModel'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexTicketTypeController extends SelectControllerInterface<
  TicketTypeModel[]
> {
  private static instance: IndexTicketTypeController
  private constructor() {
    super()
  }
  private IndexTicketTypeUseCase = new IndexTicketTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexTicketTypeController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<TicketTypeModel[]> = await this.IndexTicketTypeUseCase.call(params)

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

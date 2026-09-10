import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type FactoryItemModel from '../../Data/models/factoryItemModel'
import IndexFactoryItemUseCase from '../../Domain/useCase/indexFactoryItemUseCase'

export default class IndexSystemFactoryItemController extends SelectControllerInterface<
  FactoryItemModel[]
> {
  private static instance: IndexSystemFactoryItemController
  private readonly indexFactoryItemUseCase = new IndexFactoryItemUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemFactoryItemController()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<FactoryItemModel[]> = await this.indexFactoryItemUseCase.call(params)
    this.setState(dataState)
    super.handleResponseDialogs()
    return this.state
  }
}

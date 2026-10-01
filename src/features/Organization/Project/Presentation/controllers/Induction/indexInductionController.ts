import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type InductionModel from '../../../Data/models/Induction/InductionModel'
import IndexInductionUseCase from '../../../Domain/useCase/Induction/indexInductionUseCase'

export default class IndexInductionController extends SelectControllerInterface<InductionModel[]> {
  private static instance: IndexInductionController
  private readonly useCase = new IndexInductionUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new IndexInductionController()
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()

    const dataState: DataState<InductionModel[]> = await this.useCase.call(params)
    this.setState(dataState)

    if (this.isDataSuccess()) {
      // success state is already stored
    } else {
      throw new Error('Error while addServices')
    }

    super.handleResponseDialogs()
    return this.state
  }
}

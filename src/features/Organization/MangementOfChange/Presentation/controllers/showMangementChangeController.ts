import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type MangementChangeModel from '../../Data/models/MangementChangeModel'
import ShowMangementChangeUseCase from '../../Domain/useCase/showMangementChangeUseCase'
import type ShowMangementChangeParams from '../../Core/params/showMangementChangeParams'

export default class ShowMangementChangeController extends ControllerInterface<MangementChangeModel> {
  private static instance: ShowMangementChangeController
  private showMangementChangeUseCase = new ShowMangementChangeUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ShowMangementChangeController()
    return this.instance
  }

  async showMangementChange(params: ShowMangementChangeParams) {
    const dataState: DataState<MangementChangeModel> =
      await this.showMangementChangeUseCase.call(params)
    this.setState(dataState)
    return this.state
  }
}

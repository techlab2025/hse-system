import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type MangementChangeModel from '../../Data/models/MangementChangeModel'
import DeleteMangementChangeUseCase from '../../Domain/useCase/deleteMangementChangeUseCase'
import type DeleteMangementChangeParams from '../../Core/params/deleteMangementChangeParams'

export default class DeleteMangementChangeController extends ControllerInterface<MangementChangeModel> {
  private static instance: DeleteMangementChangeController
  private deleteMangementChangeUseCase = new DeleteMangementChangeUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new DeleteMangementChangeController()
    return this.instance
  }

  async deleteMangementChange(params: DeleteMangementChangeParams) {
    const dataState: DataState<MangementChangeModel> =
      await this.deleteMangementChangeUseCase.call(params)
    this.setState(dataState)
    return this.state
  }
}

import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type MangementChangeModel from '../../Data/models/MangementChangeModel'
import EditMangementChangeUseCase from '../../Domain/useCase/editMangementChangeUseCase'
import type EditMangementChangeParams from '../../Core/params/editMangementChangeParams'

export default class EditMangementChangeController extends ControllerInterface<MangementChangeModel> {
  private static instance: EditMangementChangeController
  private editMangementChangeUseCase = new EditMangementChangeUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new EditMangementChangeController()
    return this.instance
  }

  async editMangementChange(params: EditMangementChangeParams) {
    const dataState: DataState<MangementChangeModel> =
      await this.editMangementChangeUseCase.call(params)
    this.setState(dataState)
    return this.state
  }
}

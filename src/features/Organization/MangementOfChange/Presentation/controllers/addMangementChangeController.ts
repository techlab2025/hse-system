import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type MangementChangeModel from '../../Data/models/MangementChangeModel'
import AddMangementChangeUseCase from '../../Domain/useCase/addMangementChangeUseCase'
import type AddMangementChangeParams from '../../Core/params/addMangementChangeParams'

export default class AddMangementChangeController extends ControllerInterface<MangementChangeModel> {
  private static instance: AddMangementChangeController
  private addMangementChangeUseCase = new AddMangementChangeUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new AddMangementChangeController()
    return this.instance
  }

  async addMangementChange(params: AddMangementChangeParams) {
    const dataState: DataState<MangementChangeModel> =
      await this.addMangementChangeUseCase.call(params)
    this.setState(dataState)
    return this.state
  }
}
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import AddFactoryItemExcelParams, {
  type FactoryItemExcelRow,
} from '../../Core/params/addFactoryItemExcelParams'
import AddFactoryItemUseCase from '../../Domain/useCase/addFactoryItemUseCase'
import type FactoryItemModel from '../../Data/models/factoryItemModel'

export default class ImportFactoryItemController extends ControllerInterface<FactoryItemModel> {
  constructor() {
    super()
  }
  async importRows(rows: FactoryItemExcelRow[]) {
    this.setLoading()
    this.setState(await new AddFactoryItemUseCase().call(new AddFactoryItemExcelParams(rows)))
    return this.state
  }
}

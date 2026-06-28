import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ShiftModel from '../../Data/models/ShiftModel'
import { EditShiftRepo } from '../repositories/EditShiftRepo'

export default class EditShiftUseCase implements UseCase<ShiftModel, Params> {
  async call(params: Params): Promise<DataState<ShiftModel>> {
    return EditShiftRepo.getInstance().call(params)
  }
}

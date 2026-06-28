import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ShiftModel from '../../Data/models/ShiftModel'
import { DeleteShiftRepo } from '../repositories/DeleteShiftRepo'

export default class DeleteShiftUseCase implements UseCase<ShiftModel, Params> {
  async call(params: Params): Promise<DataState<ShiftModel>> {
    return DeleteShiftRepo.getInstance().call(params)
  }
}

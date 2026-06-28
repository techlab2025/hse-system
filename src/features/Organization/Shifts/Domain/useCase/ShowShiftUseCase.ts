import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ShiftDetailsModel from '../../Data/models/ShiftDetailsModel'
import { ShowShiftRepo } from '../repositories/ShowShiftRepo'

export default class ShowShiftUseCase implements UseCase<ShiftDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ShiftDetailsModel>> {
    return ShowShiftRepo.getInstance().call(params)
  }
}

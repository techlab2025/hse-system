import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'

import type Params from '@/base/core/params/params'
import type IncedantModel from '../../Data/models/IncedantModel'
import { AddIncedantRepo } from '../repositories/addIncedantRepo'

export default class AddIncedantUseCase implements UseCase<IncedantModel, Params> {
  async call(params: Params): Promise<DataState<IncedantModel>> {
    return AddIncedantRepo.getInstance().call(params)
  }
}

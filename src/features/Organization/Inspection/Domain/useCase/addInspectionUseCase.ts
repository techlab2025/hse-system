import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'

import type Params from '@/base/core/params/params'
import type InspectionModel from '../../Data/models/InspectionModel'
import { AddInspectionRepo } from '../repositories/addInspectionRepo'

export default class AddInspectionUseCase implements UseCase<InspectionModel, Params> {
  async call(params: Params): Promise<DataState<InspectionModel>> {
    return AddInspectionRepo.getInstance().call(params)
  }
}

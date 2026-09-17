import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteDrillTypeRepo } from '../repositories/deleteDrillTypeRepo'
import type DrillTypeModel from '../../Data/models/DrillTypeModel'

export default class DeleteDrillTypeUseCase implements UseCase<DrillTypeModel, Params> {
  async call(params: Params): Promise<DataState<DrillTypeModel>> {
    return DeleteDrillTypeRepo.getInstance().call(params)
  }
}

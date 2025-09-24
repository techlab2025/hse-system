import type Params from '@/base/core/params/params'
import type HazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteHazardTypeRepo } from '@/features/setting/HazardType/Domain/repositories/deleteHazardTypeRepo'

export default class DeleteHazardTypeUseCase implements UseCase<HazardTypeModel, Params> {
  async call(params: Params): Promise<DataState<HazardTypeModel>> {
    return DeleteHazardTypeRepo.getInstance().call(params)
  }
}

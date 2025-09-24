import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DisActiveHazardTypeRepo } from '@/features/setting/HazardType/Domain/repositories/disActiveHazardTypeRepo'
import type HazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeModel'

export default class DisHazardTypeUseCase implements UseCase<HazardTypeModel, Params> {
  async call(params: Params): Promise<DataState<HazardTypeModel>> {
    return DisActiveHazardTypeRepo.getInstance().call(params)
  }
}

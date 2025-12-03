import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { FetchProjectZoneRepo } from '../repositories/FetchProjectZoneRepo'
import type ProjectZoneModel from '../../Data/models/ProjectZonesModel'

export default class FetchProjectZoneUseCase implements UseCase<ProjectZoneModel[], Params> {
  async call(params: Params): Promise<DataState<ProjectZoneModel[]>> {
    return FetchProjectZoneRepo.getInstance().call(params)
  }
}

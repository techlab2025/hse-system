import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectLocationZonesModel from '../../Data/models/ProjectLocationZones'
import { IndexProjectLocationZonesRepo } from '../repositories/fetchLocationZonesRepo'

export default class IndexProjectLocationZonesUseCase
  implements UseCase<ProjectLocationZonesModel[], Params>
{
  async call(params: Params): Promise<DataState<ProjectLocationZonesModel[]>> {
    return IndexProjectLocationZonesRepo.getInstance().call(params)
  }
}

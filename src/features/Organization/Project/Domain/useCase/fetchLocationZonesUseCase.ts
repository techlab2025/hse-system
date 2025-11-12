import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
// import type ProjectLocationZonesModel from '../../Data/models/ProjectLocationZones'
import { IndexProjectLocationZonesRepo } from '../repositories/fetchLocationZonesRepo'
import type SohwProjectZoonModel from '../../Data/models/ShowProjectZone'

export default class IndexProjectLocationZonesUseCase
  implements UseCase<SohwProjectZoonModel[], Params>
{
  async call(params: Params): Promise<DataState<SohwProjectZoonModel[]>> {
    return IndexProjectLocationZonesRepo.getInstance().call(params)
  }
}

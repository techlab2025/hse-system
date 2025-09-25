import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ServiceLogModel from '../../Data/models/ServiceLogModel'
import { IndexServiceLogRepo } from '../repositories/indexServiceLogRepo'

export default class IndexServiceLogUseCase implements UseCase<ServiceLogModel[], Params> {
  async call(params: Params): Promise<DataState<ServiceLogModel[]>> {
    return IndexServiceLogRepo.getInstance().call(params)
  }
}

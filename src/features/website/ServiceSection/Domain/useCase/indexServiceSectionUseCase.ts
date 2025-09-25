import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ServiceSectionModel from '../../Data/models/ServiceSectionModel'
import { IndexServiceSectionRepo } from '../repositories/indexServiceSectionRepo'

export default class IndexServiceSectionUseCase implements UseCase<ServiceSectionModel[], Params> {
  async call(params: Params): Promise<DataState<ServiceSectionModel[]>> {
    return IndexServiceSectionRepo.getInstance().call(params)
  }
}

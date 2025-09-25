import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ServiceLogModel from '../../Data/models/ServiceLogModel'
import { AddServiceLogRepo } from '../repositories/addServiceLogRepo'

export default class AddServiceLogUseCase implements UseCase<ServiceLogModel, Params> {
  async call(params: Params): Promise<DataState<ServiceLogModel>> {
    return AddServiceLogRepo.getInstance().call(params)
  }
}

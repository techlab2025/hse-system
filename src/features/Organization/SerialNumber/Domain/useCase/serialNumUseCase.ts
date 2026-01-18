import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { SerialNumberRepo } from '../repositories/serialNumRepo'
import type SerialNumberModel from '../../Data/models/serialNumberModel'

export default class SerialNumUseCase implements UseCase<SerialNumberModel, Params> {
  async call(params: Params): Promise<DataState<SerialNumberModel>> {
    return SerialNumberRepo.getInstance().call(params)
  }
}

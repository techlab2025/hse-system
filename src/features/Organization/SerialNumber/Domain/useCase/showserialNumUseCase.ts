import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
// import { SerialNumberRepo } from '../repositories/addserialNumRepo'
import type SerialNumberModel from '../../Data/models/serialNumberModel'
import {  ShowSerialNumberRepo } from '../repositories/showSerialNumberRepo'

export default class ShowSerialNumberUseCase implements UseCase<SerialNumberModel[], Params> {
  async call(params: Params): Promise<DataState<SerialNumberModel[]>> {
    return ShowSerialNumberRepo.getInstance().call(params)
  }
}

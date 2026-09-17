import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PTWTypeModel from '../../Data/models/PTWTypeModel'
import { AddPTWTypeCloneRepo } from '../repositories/AddPTWTypeCloneRepo'

export default class AddPTWTypeCloneUseCase implements UseCase<PTWTypeModel, Params> {
  async call(params: Params): Promise<DataState<PTWTypeModel>> {
    return AddPTWTypeCloneRepo.getInstance().call(params)
  }
}

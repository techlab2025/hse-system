import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddPTWTypeRepo } from '../repositories/addPTWTypeRepo'
import type PTWTypeModel from '../../Data/models/PTWTypeModel'


export default class AddPTWTypeUseCase implements UseCase<PTWTypeModel, Params> {
  async call(params: Params): Promise<DataState<PTWTypeModel>> {
    return AddPTWTypeRepo.getInstance().call(params)
  }
}

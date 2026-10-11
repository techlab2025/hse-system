import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddPPEToolRepo } from '../repositories/addPPEToolRepo'
import type PPEToolModel from '../../Data/models/PPEToolModel'


export default class AddPPEToolUseCase implements UseCase<PPEToolModel, Params> {
  async call(params: Params): Promise<DataState<PPEToolModel>> {
    return AddPPEToolRepo.getInstance().call(params)
  }
}

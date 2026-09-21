import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddPPEActivityRepo } from '../repositories/addPPEActivityRepo'
import type PPEActivityModel from '../../Data/models/PPEActivityModel'


export default class AddPPEActivityUseCase implements UseCase<PPEActivityModel, Params> {
  async call(params: Params): Promise<DataState<PPEActivityModel>> {
    return AddPPEActivityRepo.getInstance().call(params)
  }
}

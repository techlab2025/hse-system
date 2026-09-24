import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditPPEActivityRepo } from '../repositories/editPPEActivityRepo'
import type PPEActivityModel from '../../Data/models/PPEActivityModel'


export default class EditPPEActivityUseCase implements UseCase<PPEActivityModel, Params> {
  async call(params: Params): Promise<DataState<PPEActivityModel>> {
    return EditPPEActivityRepo.getInstance().call(params)
  }
}

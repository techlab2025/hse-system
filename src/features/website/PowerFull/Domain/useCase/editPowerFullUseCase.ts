import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PowerFullModel from '../../Data/models/PowerFullModel'
import { EditPowerFullRepo } from '../repositories/editPowerFullRepo'




export default class EditPowerFullUseCase implements UseCase<PowerFullModel, Params> {
  async call(params: Params): Promise<DataState<PowerFullModel>> {
    return EditPowerFullRepo.getInstance().call(params)
  }
}

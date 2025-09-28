import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemComponentModel from '../../Data/models/SystemComponentModel'
import { EditSystemComponentRepo } from '../repositories/editSystemComponentRepo'

export default class EditSystemComponentUseCase implements UseCase<SystemComponentModel, Params> {
  async call(params: Params): Promise<DataState<SystemComponentModel>> {
    return EditSystemComponentRepo.getInstance().call(params)
  }
}

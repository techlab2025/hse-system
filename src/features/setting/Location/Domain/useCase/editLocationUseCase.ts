import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type LocationModel from '../../Data/models/LocationModel'
import { EditLocationRepo } from '../repositories/editLocationRepo'

export default class EditLocationUseCase implements UseCase<LocationModel, Params> {
  async call(params: Params): Promise<DataState<LocationModel>> {
    return EditLocationRepo.getInstance().call(params)
  }
}

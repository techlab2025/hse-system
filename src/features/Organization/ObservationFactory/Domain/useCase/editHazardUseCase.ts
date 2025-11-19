import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditHazardRepo } from '../repositories/editHazardRepo'
import type HazardModel from '../../Data/models/hazardModel'

export default class EditHazardUseCase implements UseCase<HazardModel, Params> {
  async call(params: Params): Promise<DataState<HazardModel>> {
    return EditHazardRepo.getInstance().call(params)
  }
}

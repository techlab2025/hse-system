import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type AccidentsTypeModel from '../../Data/models/AccidentsTypeModel'
import { AddAccidentsTypeRepo } from '../repositories/addAccidentsTypeRepo'

export default class AddAccidentsTypeUseCase implements UseCase<AccidentsTypeModel, Params> {
  async call(params: Params): Promise<DataState<AccidentsTypeModel>> {
    return AddAccidentsTypeRepo.getInstance().call(params)
  }
}

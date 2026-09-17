import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddDrillTypeRepo } from '../repositories/addDrillTypeRepo'
import type DrillTypeModel from '../../Data/models/DrillTypeModel'


export default class AddDrillTypeUseCase implements UseCase<DrillTypeModel, Params> {
  async call(params: Params): Promise<DataState<DrillTypeModel>> {
    return AddDrillTypeRepo.getInstance().call(params)
  }
}

import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditDrillTypeRepo } from '../repositories/editDrillTypeRepo'
import type DrillTypeModel from '../../Data/models/DrillTypeModel'


export default class EditDrillTypeUseCase implements UseCase<DrillTypeModel, Params> {
  async call(params: Params): Promise<DataState<DrillTypeModel>> {
    return EditDrillTypeRepo.getInstance().call(params)
  }
}

import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FactoryModel from '../../Data/models/FactoryModel'
import { EditFactoryRepo } from '../repositories/editFactoryRepo'


export default class EditFactoryUseCase implements UseCase<FactoryModel, Params> {
  async call(params: Params): Promise<DataState<FactoryModel>> {
    return EditFactoryRepo.getInstance().call(params)
  }
}

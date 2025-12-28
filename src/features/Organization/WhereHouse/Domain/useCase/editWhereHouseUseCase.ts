import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditWhereHouseRepo } from '../repositories/editWhereHouseRepo'
import type WhereHouseModel from '../../Data/models/WhereHouseModel'


export default class EditWhereHouseUseCase implements UseCase<WhereHouseModel, Params> {
  async call(params: Params): Promise<DataState<WhereHouseModel>> {
    return EditWhereHouseRepo.getInstance().call(params)
  }
}

import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type WhereHouseTypeModel from '../../Data/models/WhereHouseTypeModel'
import { AddWarehouseTypeCloneRepo } from '../repositories/AddWarehouseTypeCloneRepo'

export default class AddWhereHouseTypeCloneUseCase implements UseCase<WhereHouseTypeModel, Params> {
  async call(params: Params): Promise<DataState<WhereHouseTypeModel>> {
    return AddWarehouseTypeCloneRepo.getInstance().call(params)
  }
}

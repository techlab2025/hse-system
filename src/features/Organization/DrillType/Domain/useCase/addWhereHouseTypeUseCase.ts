import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddWhereHouseTypeRepo } from '../repositories/addWhereHouseTypeRepo'
import type WhereHouseTypeModel from '../../Data/models/WhereHouseTypeModel'


export default class AddWhereHouseTypeteUseCase implements UseCase<WhereHouseTypeModel, Params> {
  async call(params: Params): Promise<DataState<WhereHouseTypeModel>> {
    return AddWhereHouseTypeRepo.getInstance().call(params)
  }
}

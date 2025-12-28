import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddWhereHouseRepo } from '../repositories/addWhereHouseRepo'
import type WhereHouseModel from '../../Data/models/WhereHouseModel'


export default class AddWhereHouseteUseCase implements UseCase<WhereHouseModel, Params> {
  async call(params: Params): Promise<DataState<WhereHouseModel>> {
    return AddWhereHouseRepo.getInstance().call(params)
  }
}

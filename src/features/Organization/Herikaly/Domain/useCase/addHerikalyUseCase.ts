import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HerikalyModel from '../../Data/models/HerikalyModel'
import { AddHerikalyRepo } from '../repositories/addHerikalyRepo'





export default class AddHerikalyUseCase implements UseCase<HerikalyModel, Params> {
  async call(params: Params): Promise<DataState<HerikalyModel>> {
    return AddHerikalyRepo.getInstance().call(params)
  }
}

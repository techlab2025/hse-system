import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemFeatureModel from '../../Data/models/SystemFeatureModel'
import { AddSystemFeatureRepo } from '../repositories/addSystemFeatureRepo'

export default class AddSystemFeatureUseCase implements UseCase<SystemFeatureModel, Params> {
  async call(params: Params): Promise<DataState<SystemFeatureModel>> {
    return AddSystemFeatureRepo.getInstance().call(params)
  }
}

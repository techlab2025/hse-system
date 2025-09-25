import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HeaderModel from '../../Data/models/HeaderModel'
import { AddHeaderRepo } from '../repositories/addHeaderRepo'



export default class AddHeaderUseCase implements UseCase<HeaderModel, Params> {
  async call(params: Params): Promise<DataState<HeaderModel>> {
    return AddHeaderRepo.getInstance().call(params)
  }
}

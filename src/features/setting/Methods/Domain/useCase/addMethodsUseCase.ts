import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type MethodsModel from '../../Data/models/MethodModel'
import { AddMethodsRepo } from '../repositories/addMethodsRepo'


export default class AddMethodsUseCase implements UseCase<MethodsModel, Params> {
  async call(params: Params): Promise<DataState<MethodsModel>> {
    return AddMethodsRepo.getInstance().call(params)
  }
}

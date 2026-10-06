import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddDocumentCategoryRepo } from '../repositories/addDocumentCategoryRepo'
import type DocumentCategoryModel from '../../Data/models/DocumentCategoryModel'

export default class AddDocumentCategoryUseCase implements UseCase<DocumentCategoryModel, Params> {
  async call(params: Params): Promise<DataState<DocumentCategoryModel>> {
    return AddDocumentCategoryRepo.getInstance().call(params)
  }
}

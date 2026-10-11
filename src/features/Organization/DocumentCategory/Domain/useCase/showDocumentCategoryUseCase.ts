import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowDocumentCategoryRepo } from '../repositories/showDocumentCategoryRepo'
import DocumentCategoryDetailsModel from '../../Data/models/DocumentCategoryDetailsModel'

export default class ShowDocumentCategoryUseCase
  implements UseCase<DocumentCategoryDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<DocumentCategoryDetailsModel>> {
    return ShowDocumentCategoryRepo.getInstance().call(params)
  }
}

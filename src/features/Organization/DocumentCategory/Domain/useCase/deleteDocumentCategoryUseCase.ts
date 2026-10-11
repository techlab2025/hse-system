import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteDocumentCategoryRepo } from '../repositories/deleteDocumentCategoryRepo'
import type DocumentCategoryModel from '../../Data/models/DocumentCategoryModel'

export default class DeleteDocumentCategoryUseCase
  implements UseCase<DocumentCategoryModel, Params>
{
  async call(params: Params): Promise<DataState<DocumentCategoryModel>> {
    return DeleteDocumentCategoryRepo.getInstance().call(params)
  }
}

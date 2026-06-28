import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type DocumentRefrenceDetailsModel from '../../Data/models/DocumentRefrenceDetailsModel'
import { ShowDocumentRefrenceRepo } from '../repositories/ShowDocumentRefrenceRepo'

export default class ShowDocumentRefrenceUseCase
  implements UseCase<DocumentRefrenceDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<DocumentRefrenceDetailsModel>> {
    return ShowDocumentRefrenceRepo.getInstance().call(params)
  }
}

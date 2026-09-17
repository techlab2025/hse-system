import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type DocumentRefrenceModel from '../../Data/models/DocumentRefrenceModel'
import { IndexDocumentRefrenceRepo } from '../repositories/IndexDocumentRefrenceRepo'

export default class IndexDocumentRefrenceUseCase
  implements UseCase<DocumentRefrenceModel[], Params>
{
  async call(params: Params): Promise<DataState<DocumentRefrenceModel[]>> {
    return IndexDocumentRefrenceRepo.getInstance().call(params)
  }
}

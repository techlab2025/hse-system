import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type DocumentRefrenceModel from '../../Data/models/DocumentRefrenceModel'
import { DeleteDocumentRefrenceRepo } from '../repositories/DeleteDocumentRefrenceRepo'

export default class DeleteDocumentRefrenceUseCase implements UseCase<DocumentRefrenceModel, Params> {
  async call(params: Params): Promise<DataState<DocumentRefrenceModel>> {
    return DeleteDocumentRefrenceRepo.getInstance().call(params)
  }
}

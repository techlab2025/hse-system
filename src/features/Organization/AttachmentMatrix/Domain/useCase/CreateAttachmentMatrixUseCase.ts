import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type AttachmentMatrixModel from '../../Data/models/AttachmentMatrixModel'
import CreateAttachmentMatrixRepo from '../repositories/CreateAttachmentMatrixRepo'

export default class CreateAttachmentMatrixUseCase
  implements UseCase<AttachmentMatrixModel, Params>
{
  call(params: Params): Promise<DataState<AttachmentMatrixModel>> {
    return CreateAttachmentMatrixRepo.getInstance().call(params)
  }
}

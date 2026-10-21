import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SentCopyResultModel from '../../Data/models/SentCopyResultModel'
import CheckSentCopyRepo from '../repositories/CheckSentCopyRepo'

export default class CheckSentCopyUseCase implements UseCase<SentCopyResultModel, Params> {
  call(params: Params): Promise<DataState<SentCopyResultModel>> {
    return CheckSentCopyRepo.getInstance().call(params)
  }
}

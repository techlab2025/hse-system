import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FaqModel from '../../Data/models/FaqModel'
import { DeleteFaqRepo } from '../repositories/deleteFaqRepo'

export default class DeleteFaqUseCase implements UseCase<FaqModel, Params> {
  async call(params: Params): Promise<DataState<FaqModel>> {
    return DeleteFaqRepo.getInstance().call(params)
  }
}
